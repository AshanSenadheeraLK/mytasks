export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['FIREBASE_API_KEY'] || "AIzaSyDLsjaqkDwOX9G5bTowyMXVtcM2549GC6I",
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || "todo-a3866.firebaseapp.com",
    projectId: process.env['FIREBASE_PROJECT_ID'] || "todo-a3866",
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || "todo-a3866.firebasestorage.app",
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || "456710557347",
    appId: process.env['FIREBASE_APP_ID'] || "1:456710557347:web:d2a069bcbe4a1fb9ab3916",
    measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || "G-MLK1HF1MTG"
  },
  deepSeekApiKey: process.env['DEEPSEEK_API_KEY'] || "sk-33bd1b357d514a3d8134cc17ab602b70"
};
