import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
  setPersistence,
  browserLocalPersistence,
  Auth,
  getAuth
} from 'firebase/auth';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private sessionTimeoutTimer: any = null;
  private authReadyResolver!: (value: boolean) => void;
  public authReady: Promise<boolean>;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.authReady = new Promise(resolve => {
      this.authReadyResolver = resolve;
    });

    if (this.isBrowser) {
      try {
        // Try to get the auth instance from window (initialized in main.ts)
        if ((window as any).auth) {
          this.auth = (window as any).auth;
          console.log('Using Auth instance from window');
        } else {
          // If not available, initialize it directly
          console.log('Initializing Auth directly in service');
          const app = (window as any).firebaseApp || initializeApp(environment.firebase);
          this.auth = getAuth(app);
          (window as any).auth = this.auth;
        }
        
        if (this.auth) {
          // Set persistence to local storage
          setPersistence(this.auth, browserLocalPersistence)
            .then(() => {
              this.initAuthStateListener();
              this.checkExistingSession();
            })
            .catch((error) => {
              console.error('Error setting persistence:', error);
              this.authReadyResolver(true);
            });
        } else {
          console.error('Failed to initialize Auth');
          this.authReadyResolver(true);
        }
      } catch (error) {
        console.error('Error initializing Auth service:', error);
        this.auth = null;
        this.authReadyResolver(true);
      }
    } else {
      // In SSR, don't initialize Auth
      this.auth = null;
      this.authReadyResolver(true);
    }
  }

  private initAuthStateListener(): void {
    if (!this.auth) return;
    
    onAuthStateChanged(this.auth, (user) => {
      if (this.authReadyResolver) {
        this.authReadyResolver(true);
        this.authReadyResolver = undefined!;
      }
      if (user) {
        this.userSubject.next(user);
        this.startSessionTimeout();
      } else {
        this.userSubject.next(null);
        this.clearSession();
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      if (this.authReadyResolver) {
        this.authReadyResolver(true);
        this.authReadyResolver = undefined!;
      }
    });
  }

  private checkExistingSession(): void {
    if (!this.auth) return;
    
    const sessionData = this.getSessionData();
    if (sessionData && this.isSessionValid(sessionData)) {
      // Session is valid, ensure user is set
      const user = this.auth.currentUser;
      if (user) {
        this.userSubject.next(user);
        this.startSessionTimeout();
      }
    } else {
      this.clearSession();
    }
  }

  private startSessionTimeout(): void {
    // Clear any existing timer
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
    }

    // Set session start time if not already set
    if (!this.getSessionData()) {
      this.setSessionData();
    }

    // Set 10-minute timeout
    this.sessionTimeoutTimer = setTimeout(() => {
      this.logout('Session expired');
    }, 10 * 60 * 1000); // 10 minutes
  }

  private getSessionData(): { loginTime: number } | null {
    if (!this.isBrowser) return null;
    try {
      const sessionData = localStorage.getItem('session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error retrieving session data:', error);
      return null;
    }
  }

  private setSessionData(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('session', JSON.stringify({
        loginTime: Date.now()
      }));
    } catch (error) {
      console.error('Error setting session data:', error);
    }
  }

  private clearSession(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem('session');
      } catch (error) {
        console.error('Error clearing session data:', error);
      }
    }
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
  }

  private isSessionValid(sessionData: { loginTime: number }): boolean {
    if (!this.isBrowser) return false;
    const currentTime = Date.now();
    const sessionDuration = currentTime - sessionData.loginTime;
    return sessionDuration < 10 * 60 * 1000; // 10 minutes
  }

  async register(email: string, password: string): Promise<void> {
    if (!this.auth) {
      throw new Error('Authentication service is not initialized');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.setSessionData();
      this.router.navigate(['/app']);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Login operations are not available on the server.');
    }
    
    if (!this.auth) {
      throw new Error('Authentication service is not initialized');
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.setSessionData();
      this.router.navigate(['/app']);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            throw new Error('Invalid email or password. Please try again.');
          case 'auth/invalid-email':
            throw new Error('The email address is not valid.');
          case 'auth/too-many-requests':
            throw new Error('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
          default:
            throw new Error('An unexpected error occurred during login. Please try again.');
        }
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  async logout(reason?: string): Promise<void> {
    if (!this.auth) {
      this.clearSession();
      this.router.navigate(['/']);
      return;
    }
    
    try {
      await signOut(this.auth);
      this.clearSession();
      
      // Navigate with optional reason
      if (reason) {
        this.router.navigate(['/'], { 
          queryParams: { message: reason }
        });
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear session and redirect on error
      this.clearSession();
      this.router.navigate(['/']);
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser || !this.auth) return false;
    const sessionData = this.getSessionData();
    return this.auth.currentUser !== null && 
           sessionData !== null && 
           this.isSessionValid(sessionData);
  }

  getCurrentUser(): User | null {
    if (this.isAuthenticated() && this.auth && this.auth.currentUser) {
      return this.auth.currentUser;
    }
    return null;
  }
} 