# Chat Interface with Firebase Firestore

This module provides a real-time chat interface that integrates with Firebase Firestore for message persistence. The chat system includes automatic message deletion after 12 hours to ensure privacy and data minimization.

## Features

- Real-time chat messaging with Firestore backend
- Modern, responsive UI that works across devices
- Automatic message expiration after 12 hours
- Conversation management
- Dark/Light theme support
- Secure data access with Firestore security rules

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Angular CLI
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created at [Firebase Console](https://console.firebase.google.com/)

### Configuration Steps

1. **Firebase Setup**

   ```
   firebase login
   firebase use --add
   ```

   Select your Firebase project when prompted.

2. **Deploy Firestore Rules**

   ```
   firebase deploy --only firestore:rules
   ```

3. **Deploy Firestore Indexes**

   ```
   firebase deploy --only firestore:indexes
   ```

4. **Deploy Cloud Functions**

   ```
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

## Firebase Security

The Firestore security rules are configured to:

- Allow users to read and write only their own messages and conversations
- Verify timestamps to prevent tampering with message creation dates
- Ensure data integrity and proper authentication

## Message Lifecycle

Messages are automatically deleted after 12 hours through two mechanisms:

1. **Cloud Function**: A scheduled cloud function runs every hour to clean up expired messages from Firestore
2. **Client-Side Cleanup**: The application also performs cleanup when users log in, providing redundancy

## Usage Guidelines

- Messages and conversations are automatically cleaned up after 12 hours
- User authentication is required to use the chat interface
- File attachments are not supported in the current version

## Development Notes

- The chat interface components are standalone Angular components
- Styling uses Tailwind CSS with custom components
- Firestore is used as the real-time database
- Messages use timestamps for proper sorting and expiration 