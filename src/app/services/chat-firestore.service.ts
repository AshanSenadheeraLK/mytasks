import { Injectable, OnDestroy } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs,
  deleteDoc,
  limit,
  DocumentData,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export interface ChatMessage {
  id?: string;
  conversationId: string;
  sender: string;
  text: string;
  role: 'user' | 'assistant';
  createdAt: any; // Will be Firestore Timestamp
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class ChatFirestoreService implements OnDestroy {
  private db: Firestore;
  private currentUserId: string | null = null;
  private messagesSubscription?: Subscription;
  private conversationsSubscription?: Subscription;
  private cleanupSubscription?: Subscription;
  
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private currentConversationSubject = new BehaviorSubject<Conversation | null>(null);
  
  messages$ = this.messagesSubject.asObservable();
  conversations$ = this.conversationsSubject.asObservable();
  currentConversation$ = this.currentConversationSubject.asObservable();

  constructor(public auth: AuthService) {
    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);

    // Subscribe to auth state to get the current user ID
    this.auth.user$.subscribe(user => {
      this.currentUserId = user?.uid || null;
      if (this.currentUserId) {
        this.loadConversations();
        
        // Set up interval to clean up old messages every hour
        this.cleanupSubscription = interval(60 * 60 * 1000).subscribe(() => {
          this.cleanupExpiredMessages();
        });
        
        // Initial cleanup
        this.cleanupExpiredMessages().catch(err => console.log('Cleanup error (non-critical):', err));
      } else {
        this.unsubscribeFromFirestore();
        this.messagesSubject.next([]);
        this.conversationsSubject.next([]);
        this.currentConversationSubject.next(null);
        
        // Debug for authentication issue
        console.log('No authenticated user found. Please log in to use chat features.');
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribeFromFirestore();
    this.cleanupSubscription?.unsubscribe();
  }

  private unsubscribeFromFirestore() {
    this.messagesSubscription?.unsubscribe();
    this.conversationsSubscription?.unsubscribe();
  }

  // Create a new conversation
  async createConversation(title: string = 'New Conversation'): Promise<string> {
    if (!this.currentUserId) throw new Error('User not authenticated');
    
    const conversationData: Omit<Conversation, 'id'> = {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: this.currentUserId
    };
    
    const docRef = await addDoc(collection(this.db, 'conversations'), conversationData);
    const conversation: Conversation = {
      id: docRef.id,
      ...conversationData
    };
    
    this.currentConversationSubject.next(conversation);
    return docRef.id;
  }

  // Load user's conversations
  private async loadConversations() {
    if (!this.currentUserId) {
      console.log('Cannot load conversations: No authenticated user');
      return;
    }
    
    try {
      const q = query(
        collection(this.db, 'conversations'),
        where('userId', '==', this.currentUserId),
        orderBy('updatedAt', 'desc')
      );
      
      this.conversationsSubscription?.unsubscribe();
      this.conversationsSubscription = new Subscription();
      
      this.conversationsSubscription.add(
        onSnapshot(q, snapshot => {
          const conversations: Conversation[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            conversations.push({
              id: doc.id,
              title: data['title'],
              lastMessage: data['lastMessage'],
              createdAt: data['createdAt'],
              updatedAt: data['updatedAt'],
              userId: data['userId']
            });
          });
          this.conversationsSubject.next(conversations);
          
          // If we have conversations but no active conversation, select the first one
          if (conversations.length > 0 && !this.currentConversationSubject.value) {
            this.setCurrentConversation(conversations[0].id);
          }
        }, 
        error => {
          console.error('Error loading conversations:', error);
          // Handle permission errors more gracefully
          this.conversationsSubject.next([]);
        })
      );
    } catch (error) {
      console.error('Error setting up conversations listener:', error);
    }
  }

  // Set current conversation and load its messages
  async setCurrentConversation(conversationId: string) {
    const conversations = this.conversationsSubject.value;
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      this.currentConversationSubject.next(conversation);
      this.loadMessages(conversationId);
    }
  }

  // Load messages for a conversation
  private loadMessages(conversationId: string) {
    if (!this.currentUserId) {
      console.log('Cannot load messages: No authenticated user');
      return;
    }
    
    try {
      const q = query(
        collection(this.db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );
      
      this.messagesSubscription?.unsubscribe();
      this.messagesSubscription = new Subscription();
      
      this.messagesSubscription.add(
        onSnapshot(q, snapshot => {
          const messages: ChatMessage[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            messages.push({
              id: doc.id,
              conversationId: data['conversationId'],
              sender: data['sender'],
              text: data['text'],
              role: data['role'],
              createdAt: data['createdAt']
            });
          });
          this.messagesSubject.next(messages);
        },
        error => {
          console.error('Error loading messages:', error);
          // Handle permission errors more gracefully
          this.messagesSubject.next([]);
        })
      );
    } catch (error) {
      console.error('Error setting up messages listener:', error);
    }
  }

  // Send a new message
  async sendMessage(text: string, role: 'user' | 'assistant' = 'user'): Promise<void> {
    if (!this.currentUserId) throw new Error('User not authenticated');
    
    let conversationId = this.currentConversationSubject.value?.id;
    
    // If no conversation exists, create one
    if (!conversationId) {
      conversationId = await this.createConversation('New Conversation');
    }
    
    // Add message to Firestore
    const messageData: Omit<ChatMessage, 'id'> = {
      conversationId,
      sender: this.currentUserId,
      text,
      role,
      createdAt: serverTimestamp()
    };
    
    await addDoc(collection(this.db, 'messages'), messageData);
    
    // Update conversation's lastMessage and updatedAt
    await this.updateConversation(conversationId, {
      lastMessage: text.substring(0, 100),
      updatedAt: serverTimestamp()
    });
  }

  // Update conversation
  private async updateConversation(conversationId: string, data: Partial<Conversation>): Promise<void> {
    if (!this.currentUserId) throw new Error('User not authenticated');
    
    const conversationRef = collection(this.db, 'conversations');
    const q = query(conversationRef, where('id', '==', conversationId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await updateDoc(doc.ref, data);
    }
  }

  // Rename conversation
  async renameConversation(conversationId: string, newTitle: string): Promise<void> {
    if (!this.currentUserId) throw new Error('User not authenticated');
    
    await this.updateConversation(conversationId, {
      title: newTitle,
      updatedAt: serverTimestamp()
    });
  }

  // Delete conversation and its messages
  async deleteConversation(conversationId: string): Promise<void> {
    if (!this.currentUserId) throw new Error('User not authenticated');
    
    const batch = writeBatch(this.db);
    
    // Delete all messages in the conversation
    const messagesRef = collection(this.db, 'messages');
    const messagesQuery = query(messagesRef, where('conversationId', '==', conversationId));
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the conversation document
    const conversationsRef = collection(this.db, 'conversations');
    const conversationQuery = query(conversationsRef, where('id', '==', conversationId));
    const conversationSnapshot = await getDocs(conversationQuery);
    if (!conversationSnapshot.empty) {
      batch.delete(conversationSnapshot.docs[0].ref);
    }
    
    // Commit the batch
    await batch.commit();
    
    // If this was the current conversation, select another one
    if (this.currentConversationSubject.value?.id === conversationId) {
      const conversations = this.conversationsSubject.value.filter(c => c.id !== conversationId);
      if (conversations.length > 0) {
        await this.setCurrentConversation(conversations[0].id);
      } else {
        this.currentConversationSubject.next(null);
      }
    }
  }

  // Clean up messages older than 12 hours
  async cleanupExpiredMessages(): Promise<void> {
    if (!this.currentUserId) return;
    
    try {
      // Calculate timestamp for 12 hours ago
      const twelveHoursAgo = new Date();
      twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
      
      // Find messages older than 12 hours
      const messagesRef = collection(this.db, 'messages');
      const q = query(
        messagesRef,
        where('sender', '==', this.currentUserId),
        where('createdAt', '<', Timestamp.fromDate(twelveHoursAgo)),
        limit(100) // Process in batches
      );
      
      const snapshot = await getDocs(q);
      
      // Delete old messages
      const batch = writeBatch(this.db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      if (snapshot.docs.length > 0) {
        await batch.commit();
        console.log(`Deleted ${snapshot.docs.length} expired messages`);
        
        // If there are possibly more messages to delete, run again
        if (snapshot.docs.length === 100) {
          await this.cleanupExpiredMessages();
        }
      }
      
      // Clean up empty conversations
      await this.cleanupEmptyConversations();
    } catch (error) {
      console.error('Error cleaning up expired messages:', error);
    }
  }
  
  // Clean up conversations with no messages
  private async cleanupEmptyConversations(): Promise<void> {
    if (!this.currentUserId) return;
    
    try {
      const conversationsRef = collection(this.db, 'conversations');
      const conversationsQuery = query(
        conversationsRef,
        where('userId', '==', this.currentUserId)
      );
      
      const conversationsSnapshot = await getDocs(conversationsQuery);
      const batch = writeBatch(this.db);
      let deletedCount = 0;
      
      // For each conversation, check if it has any messages
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesRef = collection(this.db, 'messages');
        const messagesQuery = query(
          messagesRef,
          where('conversationId', '==', conversationDoc.id),
          limit(1)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        
        // If no messages, delete the conversation
        if (messagesSnapshot.empty) {
          batch.delete(conversationDoc.ref);
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        await batch.commit();
        console.log(`Deleted ${deletedCount} empty conversations`);
      }
    } catch (error) {
      console.error('Error cleaning up empty conversations:', error);
    }
  }
}

