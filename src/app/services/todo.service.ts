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
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService implements OnDestroy {
  private db: Firestore | null = null;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  private unsubscribe?: Unsubscribe;
  private authSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
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

  async addTodo(title: string, description?: string, dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const todoData: Omit<Todo, 'id' | 'createdAt'> & { createdAt: any } = {
      title,
      description,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
      priority
    };

    if (dueDate) {
      todoData.dueDate = dueDate;
    }

    try {
      await addDoc(collection(this.db, 'todos'), todoData);
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
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