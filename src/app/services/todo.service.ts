import { Injectable, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  Firestore,
  getFirestore
} from 'firebase/firestore';
import { AuthService } from './auth.service';
import { AiAgentService } from './ai-agent.service';
import { NotificationService } from './notification.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

export interface Todo {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp | Date;
  dueDate?: Timestamp | Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  subtasks?: { title: string; completed: boolean }[];
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
  sharedWith?: string[];
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService implements OnDestroy {
  private db: Firestore | null = null;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  /** Get a snapshot of current todos */
  get currentTodos(): Todo[] {
    return this.todosSubject.value;
  }
  private unsubscribe?: Unsubscribe;
  private authSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private aiAgent: AiAgentService,
    private notification: NotificationService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Try to get the Firestore instance from window (initialized in main.ts)
        if ((window as any).db) {
          this.db = (window as any).db;
          console.log('Using Firestore instance from window');
        } else {
          // If not available, initialize it directly
          console.log('Initializing Firestore directly in service');
          const app = initializeApp(environment.firebase);
          this.db = getFirestore(app);
          (window as any).db = this.db;
        }
        
        // Initialize todos listener only after db is available
        if (this.db) {
          this.initTodosListener();
        } else {
          console.error('Unable to initialize Firestore');
        }
      } catch (error) {
        console.error('Error initializing Firestore in TodoService:', error);
        this.db = null;
      }
    } else {
      // In SSR, don't initialize Firestore
      this.db = null;
    }
  }

  initTodosListener(): void {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;

    this.authSubscription = this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.listenToTodos(user.uid);
        } else {
          this.todosSubject.next([]);
          this.cleanupFirestoreListener();
        }
      });
  }

  private cleanupFirestoreListener(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  listenToTodos(userId: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    try {
      const todosRef = collection(this.db, 'todos');
      const q = query(todosRef, where('userId', '==', userId));
      
      this.unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const todos = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data['title'],
            description: data['description'],
            completed: data['completed'] || false,
            userId: data['userId'],
            createdAt: data['createdAt'],
            dueDate: data['dueDate'],
            priority: data['priority'] || 'medium'
          } as Todo;
        });
        this.todosSubject.next(todos);
      }, (error) => {
        console.error('Error listening to todos:', error);
        this.todosSubject.next([]); 
      });
    } catch (error) {
      console.error('Error setting up todos listener:', error);
      this.todosSubject.next([]);
    }
  }

  async addTodo(
    title: string,
    description?: string,
    dueDate?: Date,
    priority: 'low' | 'medium' | 'high' = 'medium',
    tags: string[] = [],
    recurring: 'daily' | 'weekly' | 'monthly' | null = null
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;

    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    if (this.isDuplicate(title, dueDate)) {
      console.warn('Duplicate todo detected, skipping add');
      return;
    }

    const todoData: Omit<Todo, 'id' | 'createdAt'> & { createdAt: any } = {
      title,
      description,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
      priority,
      tags,
      recurring
    };

    if (dueDate) {
      todoData.dueDate = dueDate;
    }

    try {
      const ref = await addDoc(collection(this.db, 'todos'), todoData);
      if (dueDate) {
        this.notification.schedule(new Date(dueDate), `Task due: ${title}`);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }

  async createTodoWithAi(prompt: string): Promise<void> {
    const result = await this.aiAgent.sendPrompt(prompt);
    if (!result) return;

    const { title, description, dueDate, tags = [], recurring = null } = result;
    const parsedDate = dueDate ? new Date(dueDate) : undefined;
    await this.addTodo(title, description, parsedDate, 'medium', tags, recurring);
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;
    
    try {
      const todoRef = doc(this.db, 'todos', id);
      await updateDoc(todoRef, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;
    
    try {
      await deleteDoc(doc(this.db, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  async toggleTodoComplete(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;
    
    const todo = this.todosSubject.value.find(t => t.id === id);
    if (!todo) throw new Error('Todo not found for toggle');
    
    await this.updateTodo(id, { completed: !todo.completed });
  }

  async shareTodoWithUser(id: string, userId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;

    try {
      const todoRef = doc(this.db, 'todos', id);
      const existing = this.todosSubject.value.find(t => t.id === id)?.sharedWith || [];
      const updated = Array.from(new Set([...existing, userId]));
      await updateDoc(todoRef, { sharedWith: updated });
    } catch (error) {
      console.error('Error sharing todo:', error);
      throw error;
    }
  }

  private isDuplicate(title: string, dueDate?: Date): boolean {
    const normTitle = title.trim().toLowerCase();
    const newDue = dueDate ? new Date(dueDate).getTime() : undefined;
    return this.currentTodos.some(t => {
      const tTitle = t.title.trim().toLowerCase();
      const existingDue = t.dueDate ? new Date(t.dueDate as any).getTime() : undefined;
      return tTitle === normTitle && existingDue === newDue;
    });
  }

  ngOnDestroy(): void {
    this.cleanupFirestoreListener();
    
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = undefined;
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
} 