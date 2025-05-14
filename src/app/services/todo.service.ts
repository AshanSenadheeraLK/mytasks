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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService implements OnDestroy {
  private db: Firestore;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  private unsubscribe?: Unsubscribe;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Get the Firestore instance from window in browser environment
        this.db = (window as any).db || getFirestore();
        this.initTodosListener();
      } catch (error) {
        console.error('Error initializing Firestore:', error);
        this.db = {} as Firestore;
      }
    } else {
      // In SSR, stub Firestore instance to prevent default app errors
      this.db = {} as Firestore;
    }
  }

  initTodosListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.authService.user$.subscribe(user => {
      if (user) {
        this.listenToTodos(user.uid);
      } else {
        this.todosSubject.next([]);
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = undefined;
        }
      }
    });
  }

  listenToTodos(userId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    try {
      const todosRef = collection(this.db, 'todos');
      const q = query(todosRef, where('userId', '==', userId));
      
      this.unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const todos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
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

  async addTodo(title: string, description?: string, dueDate?: Date): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const todoData: Omit<Todo, 'id' | 'createdAt'> & { createdAt: any } = {
      title,
      description,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp()
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
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const todoRef = doc(this.db, 'todos', id);
      await updateDoc(todoRef, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      await deleteDoc(doc(this.db, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  async toggleTodoComplete(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const todo = this.todosSubject.value.find(t => t.id === id);
    if (!todo) throw new Error('Todo not found for toggle');
    
    await this.updateTodo(id, { completed: !todo.completed });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
} 