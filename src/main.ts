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

// Bootstrap JS should not be imported globally here for SSR compatibility
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// Initialize Firebase conditionally
let firebaseApp: FirebaseApp;
let db: any;
let auth: any;

// Function to initialize Firebase
function initializeFirebase() {
  if (!firebaseApp) {
    console.log('Initializing Firebase...');
    firebaseApp = initializeApp(environment.firebase);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  }
  return { firebaseApp, db, auth };
}

// Function to initialize analytics
async function initializeAnalytics() {
  if (typeof window !== 'undefined') {
    const supported = await isAnalyticsSupported();
    if (supported) {
      console.log('Firebase Analytics is supported. Initializing...');
      return getAnalytics(firebaseApp);
    }
  }
  console.log('Firebase Analytics is NOT supported in this environment.');
  return null;
}

// Bootstrap the application
const bootstrap = async () => {
  if (typeof window !== 'undefined') {
    // Initialize Firebase only in browser environment
    const { firebaseApp: app, db: database, auth: authentication } = initializeFirebase();
    // Export for use in other files
    (window as any).firebaseApp = app;
    (window as any).db = database;
    (window as any).auth = authentication;
  }

  return bootstrapApplication(AppComponent, browserConfig)
    .then(() => initializeAnalytics())
    .catch(err => console.error('Error bootstrapping app:', err));
};

// Initialize the application
bootstrap();
