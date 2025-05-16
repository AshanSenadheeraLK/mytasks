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
  getAuth,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
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
  private db: any = null;
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

        // Get Firestore instance
        if ((window as any).db) {
          this.db = (window as any).db;
          console.log('Using Firestore instance from window');
        } else {
          console.log('Initializing Firestore directly in service');
          const app = (window as any).firebaseApp || initializeApp(environment.firebase);
          this.db = getFirestore(app);
          (window as any).db = this.db;
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
        this.db = null;
        this.authReadyResolver(true);
      }
    } else {
      // In SSR, don't initialize Auth
      this.auth = null;
      this.db = null;
      this.authReadyResolver(true);
    }
  }

  private initAuthStateListener(): void {
    if (!this.auth) return;
    
    onAuthStateChanged(this.auth, async (user) => {
      if (this.authReadyResolver) {
        this.authReadyResolver(true);
        this.authReadyResolver = undefined!;
      }
      
      if (user) {
        console.log('Auth state changed: User logged in', user.uid);
        
        // If we have a Firestore instance, sync the user data first
        if (this.db) {
          try {
            await this.syncUserWithFirestore(user);
            // Get fresh user data after syncing
            user = this.auth?.currentUser || user;
          } catch (error) {
            console.error('Error syncing user data on auth state change:', error);
          }
        }
        
        // Notify subscribers with the latest user data
        this.userSubject.next({...user});
        this.startSessionTimeout();
      } else {
        console.log('Auth state changed: User logged out');
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
      
      // Create user profile in Firestore
      if (this.db && userCredential.user) {
        await this.saveUserToFirestore(userCredential.user);
      }
      
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
      
      // Sync user data with Firestore
      if (this.db && userCredential.user) {
        await this.syncUserWithFirestore(userCredential.user);
      }
      
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

  // Helper method to sync user data with Firestore on login
  private async syncUserWithFirestore(user: User): Promise<void> {
    if (!this.db) return;
    
    try {
      console.log('Syncing user with Firestore:', user.uid);
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create the user document if it doesn't exist yet
        console.log('User not found in Firestore, creating profile');
        await this.saveUserToFirestore(user);
      } else {
        // User exists in Firestore
        console.log('User found in Firestore, checking profile data');
        const userData = userDoc.data();
        
        // If user has a displayName in Firestore but not in Auth, update Auth
        if (userData['displayName'] && (!user.displayName || user.displayName !== userData['displayName'])) {
          console.log('Updating Auth profile with displayName from Firestore:', userData['displayName']);
          await updateProfile(user, {
            displayName: userData['displayName']
          });
          
          // Update the BehaviorSubject to reflect changes immediately
          this.userSubject.next({...user});
          console.log('Updated Auth profile with displayName from Firestore');
        } else if (user.displayName && (!userData['displayName'] || userData['displayName'] !== user.displayName)) {
          // If Auth has displayName but Firestore doesn't match, update Firestore
          console.log('Updating Firestore with Auth displayName:', user.displayName);
          await updateDoc(userRef, {
            displayName: user.displayName,
            lastUpdated: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error syncing user with Firestore:', error);
      // Don't throw - we don't want to break auth flow if Firestore fails
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
    } catch (error) {
      console.error('Logout error:', error);
      this.clearSession();
      this.router.navigate(['/']);
    }
  }

  async updateProfile(profileData: { displayName?: string, photoURL?: string }): Promise<void> {
    if (!this.auth || !this.auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      const user = this.auth.currentUser;
      await updateProfile(user, profileData);
      
      // Save profile to Firestore
      if (this.db) {
        await this.saveUserToFirestore(user);
      }
      
      // Update the BehaviorSubject to reflect changes immediately
      this.userSubject.next(user);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  // Helper method to save user data to Firestore
  private async saveUserToFirestore(user: User): Promise<void> {
    if (!this.db) return;
    
    try {
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const userData = {
        email: user.email || '',
        displayName: user.displayName || user.email || '',
        photoURL: user.photoURL || '',
        lastUpdated: serverTimestamp()
      };
      
      console.log('Saving user data to Firestore:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp()
        });
        console.log('Created new user profile in Firestore');
      } else {
        // Update existing user document
        await updateDoc(userRef, userData);
        console.log('Updated user profile in Firestore');
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Don't throw - we don't want to break auth flow if Firestore fails
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

  async updateDisplayName(displayName: string): Promise<void> {
    console.log('Updating display name to:', displayName);
    
    if (!this.auth || !this.auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    try {
      const user = this.auth.currentUser;
      
      // Update Firebase Auth profile first (this always works if authenticated)
      await updateProfile(user, { displayName });
      console.log('Updated Firebase Auth display name');
      
      // Try to update Firestore, but don't fail if it errors
      if (this.db) {
        try {
          const userRef = doc(this.db, 'users', user.uid);
          await updateDoc(userRef, { 
            displayName,
            lastUpdated: serverTimestamp()
          });
          console.log('Updated Firestore display name');
        } catch (firestoreError) {
          // If permission error, try to create the document instead
          console.warn('Error updating Firestore profile, attempting to create document:', firestoreError);
          
          try {
            const userRef = doc(this.db, 'users', user.uid);
            await setDoc(userRef, {
              email: user.email || '',
              displayName,
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp(),
              lastUpdated: serverTimestamp()
            });
            console.log('Created Firestore profile document');
          } catch (createError) {
            // Don't fail the overall operation if Firestore fails
            console.error('Could not write to Firestore, but Auth profile was updated:', createError);
          }
        }
      }
      
      // Force refresh the user object to ensure changes are picked up
      const updatedUser = this.auth.currentUser;
      this.userSubject.next({...updatedUser});
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Display name update error:', error);
      throw new Error(error.message || 'Failed to update display name');
    }
  }
} 