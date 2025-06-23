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
  getFirestore,
  writeBatch,
  orderBy,
  limit,
  getDoc,
  DocumentReference,
  DocumentSnapshot,
  WhereFilterOp,
  QueryConstraint,
  startAfter,
  endBefore,
  QueryDocumentSnapshot,
  runTransaction
} from 'firebase/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subject, Subscription, from, throwError } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
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
  tags?: string[];
  category?: string;
  attachments?: string[];
  subtasks?: SubTask[];
  lastModified?: Timestamp | Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskQuery {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface TaskQueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: DocumentSnapshot<DocumentData>;
  endBefore?: DocumentSnapshot<DocumentData>;
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
  private lastQuerySnapshot?: QueryDocumentSnapshot<DocumentData>;

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
      const todosRef = collection(this.db!, 'todos');
      // Modified query to only filter by userId without ordering
      // This avoids the need for a composite index
      const q = query(
        todosRef, 
        where('userId', '==', userId)
      );
      
      this.unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        // Convert the documents to Todo objects
        let todos = querySnapshot.docs.map(doc => this.convertFirestoreDocToTodo(doc));
        
        // Sort the results in memory instead of using orderBy in the query
        todos = todos.sort((a, b) => {
          // Handle both Date objects and Firestore Timestamps
          const dateA = a.createdAt instanceof Date ? a.createdAt : 
                        ('toDate' in a.createdAt ? a.createdAt.toDate() : new Date());
          const dateB = b.createdAt instanceof Date ? b.createdAt : 
                        ('toDate' in b.createdAt ? b.createdAt.toDate() : new Date());
          
          // Sort in descending order (newest first)
          return dateB.getTime() - dateA.getTime();
        });
        
        this.todosSubject.next(todos);
        
        // Save the last document for pagination
        if (querySnapshot.docs.length > 0) {
          this.lastQuerySnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
        }
      }, (error) => {
        console.error('Error listening to todos:', error);
        this.todosSubject.next([]); 
      });
    } catch (error) {
      console.error('Error setting up todos listener:', error);
      this.todosSubject.next([]);
    }
  }
  
  private convertFirestoreDocToTodo(doc: QueryDocumentSnapshot<DocumentData>): Todo {
    const data = doc.data();
    return {
      id: doc.id,
      title: data['title'] || '',
      description: data['description'] || '',
      completed: data['completed'] || false,
      userId: data['userId'] || '',
      createdAt: data['createdAt'] || new Date(),
      dueDate: data['dueDate'],
      priority: data['priority'] || 'medium',
      tags: data['tags'] || [],
      category: data['category'] || '',
      attachments: data['attachments'] || [],
      subtasks: data['subtasks'] || [],
      lastModified: data['lastModified'] || data['createdAt'] || new Date()
    } as Todo;
  }

  async addTodo(title: string, description?: string, dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const todoData: Omit<Todo, 'id' | 'createdAt' | 'lastModified'> & { 
      createdAt: any,
      lastModified: any 
    } = {
      title,
      description: description || '',
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      priority,
      tags: [],
      category: '',
      attachments: [],
      subtasks: []
    };

    if (dueDate) {
      todoData.dueDate = dueDate;
    }

    try {
      const docRef = await addDoc(collection(this.db!, 'todos'), todoData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      // Add lastModified timestamp to updates
      const updatesWithTimestamp = {
        ...updates,
        lastModified: serverTimestamp()
      };
      
      const todoRef = doc(this.db!, 'todos', id);
      await updateDoc(todoRef, updatesWithTimestamp);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      await deleteDoc(doc(this.db!, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  async toggleTodoComplete(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    const todo = this.todosSubject.value.find(t => t.id === id);
    if (!todo) throw new Error('Todo not found for toggle');
    
    await this.updateTodo(id, { completed: !todo.completed });
  }
  
  // New methods for enhanced CRUD operations
  
  /**
   * Get a single todo by ID
   */
  getTodoById(id: string): Observable<Todo> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      return throwError(() => new Error('Database not available'));
    
    return from(getDoc(doc(this.db!, 'todos', id))).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data
          } as Todo;
        } else {
          throw new Error('Todo not found');
        }
      }),
      catchError(error => {
        console.error('Error getting todo by ID:', error);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Add multiple todos at once using batch write
   */
  async addMultipleTodos(todos: Omit<Todo, 'id' | 'createdAt' | 'userId' | 'lastModified'>[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    try {
      const batch = writeBatch(this.db!);
      const todosRef = collection(this.db!, 'todos');
      
      todos.forEach(todo => {
        const newTodoRef = doc(todosRef);
        batch.set(newTodoRef, {
          ...todo,
          userId: user.uid,
          completed: todo.completed || false,
          createdAt: serverTimestamp(),
          lastModified: serverTimestamp(),
          priority: todo.priority || 'medium'
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error adding multiple todos:', error);
      throw error;
    }
  }
  
  /**
   * Update multiple todos at once using batch write
   */
  async updateMultipleTodos(updates: {id: string, data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>}[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const batch = writeBatch(this.db!);
      
      updates.forEach(update => {
        const todoRef = doc(this.db!, 'todos', update.id);
        batch.update(todoRef, {
          ...update.data,
          lastModified: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating multiple todos:', error);
      throw error;
    }
  }
  
  /**
   * Delete multiple todos at once using batch write
   */
  async deleteMultipleTodos(ids: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const batch = writeBatch(this.db!);
      
      ids.forEach(id => {
        const todoRef = doc(this.db!, 'todos', id);
        batch.delete(todoRef);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting multiple todos:', error);
      throw error;
    }
  }
  
  /**
   * Query todos with custom filters
   */
  async queryTodos(
    queries: TaskQuery[], 
    options: TaskQueryOptions = {}
  ): Promise<Todo[]> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    try {
      const todosRef = collection(this.db!, 'todos');
      
      // Build query constraints
      const queryConstraints: QueryConstraint[] = [
        where('userId', '==', user.uid)
      ];
      
      // Add custom query filters
      queries.forEach(q => {
        queryConstraints.push(where(q.field, q.operator, q.value));
      });
      
      // Store ordering options for in-memory sort
      const orderByField = options.orderByField;
      const orderDirection = options.orderDirection || 'asc';
      
      // Add pagination constraints without orderBy to avoid index requirements
      if (options.startAfter) {
        queryConstraints.push(startAfter(options.startAfter));
      }
      
      if (options.endBefore) {
        queryConstraints.push(endBefore(options.endBefore));
      }
      
      // Add limit if specified
      if (options.limit) {
        queryConstraints.push(limit(options.limit));
      }
      
      const q = query(todosRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Convert documents to Todo objects
      let todos = querySnapshot.docs.map(doc => this.convertFirestoreDocToTodo(doc));
      
      // Sort in memory if an orderByField was specified
      if (orderByField) {
        todos = this.sortTodos(todos, orderByField, orderDirection);
      }
      
      return todos;
    } catch (error) {
      console.error('Error querying todos:', error);
      throw error;
    }
  }
  
  /**
   * Sort todos in memory by a specified field
   */
  private sortTodos(todos: Todo[], orderByField: string, orderDirection: 'asc' | 'desc'): Todo[] {
    return todos.sort((a, b) => {
      // Get the values to compare
      let valueA: any = a[orderByField as keyof Todo];
      let valueB: any = b[orderByField as keyof Todo];
      
      // Handle undefined values
      if (valueA === undefined && valueB === undefined) return 0;
      if (valueA === undefined) return orderDirection === 'asc' ? -1 : 1;
      if (valueB === undefined) return orderDirection === 'asc' ? 1 : -1;
      
      // Handle dates specially
      if (orderByField === 'createdAt' || orderByField === 'dueDate' || orderByField === 'lastModified') {
        // Convert to Date objects for comparison
        const dateA = valueA instanceof Date ? valueA : 
                     (valueA && typeof valueA === 'object' && 'toDate' in valueA ? valueA.toDate() : new Date(0));
        const dateB = valueB instanceof Date ? valueB : 
                     (valueB && typeof valueB === 'object' && 'toDate' in valueB ? valueB.toDate() : new Date(0));
        
        // Compare timestamps
        const comparison = dateA.getTime() - dateB.getTime();
        return orderDirection === 'asc' ? comparison : -comparison;
      }
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return orderDirection === 'asc' ? comparison : -comparison;
      }
      
      // Handle boolean comparison
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        const comparison = valueA === valueB ? 0 : valueA ? 1 : -1;
        return orderDirection === 'asc' ? comparison : -comparison;
      }
      
      // Default comparison for other types
      if (valueA < valueB) return orderDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  /**
   * Add or update a subtask for a todo
   */
  async addOrUpdateSubtask(todoId: string, subtask: SubTask): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const todoRef = doc(this.db!, 'todos', todoId);
      const todoSnap = await getDoc(todoRef);
      
      if (!todoSnap.exists()) {
        throw new Error('Todo not found');
      }
      
      const todoData = todoSnap.data();
      const subtasks = todoData['subtasks'] || [];
      
      // Check if subtask already exists
      const existingIndex = subtasks.findIndex((s: SubTask) => s.id === subtask.id);
      
      if (existingIndex >= 0) {
        // Update existing subtask
        subtasks[existingIndex] = subtask;
      } else {
        // Add new subtask
        subtasks.push(subtask);
      }
      
      await updateDoc(todoRef, { 
        subtasks, 
        lastModified: serverTimestamp() 
      });
    } catch (error) {
      console.error('Error adding/updating subtask:', error);
      throw error;
    }
  }
  
  /**
   * Remove a subtask from a todo
   */
  async removeSubtask(todoId: string, subtaskId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const todoRef = doc(this.db!, 'todos', todoId);
      
      await runTransaction(this.db!, async (transaction) => {
        const todoDoc = await transaction.get(todoRef);
        
        if (!todoDoc.exists()) {
          throw new Error('Todo not found');
        }
        
        const todoData = todoDoc.data();
        const subtasks = todoData['subtasks'] || [];
        const updatedSubtasks = subtasks.filter((s: SubTask) => s.id !== subtaskId);
        
        transaction.update(todoRef, { 
          subtasks: updatedSubtasks,
          lastModified: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error removing subtask:', error);
      throw error;
    }
  }
  
  /**
   * Add tags to a todo
   */
  async addTags(todoId: string, tags: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const todoRef = doc(this.db!, 'todos', todoId);
      
      await runTransaction(this.db!, async (transaction) => {
        const todoDoc = await transaction.get(todoRef);
        
        if (!todoDoc.exists()) {
          throw new Error('Todo not found');
        }
        
        const todoData = todoDoc.data();
        const currentTags = todoData['tags'] || [];
        
        // Add only unique tags
        const uniqueTags = [...new Set([...currentTags, ...tags])];
        
        transaction.update(todoRef, { 
          tags: uniqueTags,
          lastModified: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error adding tags:', error);
      throw error;
    }
  }
  
  /**
   * Remove tags from a todo
   */
  async removeTags(todoId: string, tags: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.db) 
      throw new Error('Database not available');
    
    try {
      const todoRef = doc(this.db!, 'todos', todoId);
      
      await runTransaction(this.db!, async (transaction) => {
        const todoDoc = await transaction.get(todoRef);
        
        if (!todoDoc.exists()) {
          throw new Error('Todo not found');
        }
        
        const todoData = todoDoc.data();
        const currentTags = todoData['tags'] || [];
        
        // Remove specified tags
        const updatedTags = currentTags.filter((tag: string) => !tags.includes(tag));
        
        transaction.update(todoRef, { 
          tags: updatedTags,
          lastModified: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error removing tags:', error);
      throw error;
    }
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