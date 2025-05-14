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
  private auth: Auth;
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
      // Get the auth instance from window in browser environment
      this.auth = (window as any).auth || getAuth();
      
      // If auth is not initialized, initialize Firebase with environment config
      if (!this.auth || !this.auth.app) {
        const app = initializeApp(environment.firebase);
        this.auth = getAuth(app);
      }
      
      // Set persistence to local storage
      setPersistence(this.auth, browserLocalPersistence)
        .then(() => {
          this.initAuthStateListener();
          this.checkExistingSession();
        })
        .catch((error) => {
          console.error('Error setting persistence:', error);
        });
    } else {
      // In SSR, stub Auth instance and resolve authReady immediately
      this.auth = {} as Auth;
      this.authReadyResolver(true);
      this.authReadyResolver = undefined!;
    }
  }

  private initAuthStateListener(): void {
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
    });
  }

  private checkExistingSession(): void {
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
    const sessionData = localStorage.getItem('session');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  private setSessionData(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('session', JSON.stringify({
      loginTime: Date.now()
    }));
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem('session');
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
      throw error;
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    const sessionData = this.getSessionData();
    return this.auth.currentUser !== null && 
           sessionData !== null && 
           this.isSessionValid(sessionData);
  }

  getCurrentUser(): User | null {
    return this.isAuthenticated() ? this.auth.currentUser : null;
  }
} 