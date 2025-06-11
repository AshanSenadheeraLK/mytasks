// Firebase imports first
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Then Angular imports
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { browserConfig } from './app/app.config.browser';
import { environment } from './environments/environment';

// Register service worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
// Import compiler to support JIT compilation
import '@angular/compiler';

// Bootstrap JS should not be imported globally here for SSR compatibility
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// Initialize Firebase
let firebaseApp: FirebaseApp;
let db: any;
let auth: any;

// Function to initialize Firebase
function initializeFirebase() {
  if (typeof window !== 'undefined' && !firebaseApp) {
    console.log('Initializing Firebase...');
    try {
      firebaseApp = initializeApp(environment.firebase);
      db = getFirestore(firebaseApp);
      auth = getAuth(firebaseApp);
      
      // Make Firebase instances available globally
      (window as any).firebaseApp = firebaseApp;
      (window as any).db = db;
      (window as any).auth = auth;
      
      return { firebaseApp, db, auth };
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return { firebaseApp: null, db: null, auth: null };
    }
  }
  return { firebaseApp, db, auth };
}

// Function to initialize analytics
async function initializeAnalytics() {
  if (typeof window !== 'undefined' && firebaseApp) {
    try {
      const supported = await isAnalyticsSupported();
      if (supported) {
        console.log('Firebase Analytics is supported. Initializing...');
        return getAnalytics(firebaseApp);
      }
    } catch (error) {
      console.error('Error initializing Firebase Analytics:', error);
    }
  }
  console.log('Firebase Analytics is NOT supported in this environment.');
  return null;
}

// Bootstrap the application
const bootstrap = async () => {
  // Initialize Firebase only in browser environment
  if (typeof window !== 'undefined') {
    initializeFirebase();
  }

  return bootstrapApplication(AppComponent, browserConfig)
    .then(() => {
      if (firebaseApp) return initializeAnalytics();
      return null;
    })
    .catch(err => console.error('Error bootstrapping app:', err));
};

// Bootstrap the standalone AppComponent
bootstrap();
