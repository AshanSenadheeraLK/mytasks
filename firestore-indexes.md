# Firestore Indexes Setup Instructions

To fix the database errors, you need to create two composite indexes in Firebase Firestore:

## 1. Messages Collection Index

Click this link to create the required index for the messages collection:
https://console.firebase.google.com/v1/r/project/todo-a3866/firestore/indexes?create_composite=Cktwcm9qZWN0cy90b2RvLWEzODY2L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9tZXNzYWdlcy9pbmRleGVzL18QARoKCgZzZW5kZXIQARoNCgljcmVhdGVkQXQQARoMCghfX25hbWVfXxAB

This index is needed for querying messages with filters on sender and createdAt fields.

## 2. Conversations Collection Index

Click this link to create the required index for the conversations collection:
https://console.firebase.google.com/v1/r/project/todo-a3866/firestore/indexes?create_composite=ClBwcm9qZWN0cy90b2RvLWEzODY2L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9jb252ZXJzYXRpb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCXVwZGF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

This index is needed for querying conversations with filters on userId and updatedAt fields.

## Alternative Manual Setup

If the links don't work, you can manually create these indexes in the Firebase console:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project
2. Navigate to Firestore Database → Indexes → Composite tab
3. Click "Add Index" and create the following indexes:

### Messages Collection Index
- Collection ID: messages
- Fields to index:
  - sender (Ascending)
  - createdAt (Ascending)
  - __name__ (Ascending)

### Conversations Collection Index
- Collection ID: conversations 
- Fields to index:
  - userId (Ascending)
  - updatedAt (Descending)
  - __name__ (Ascending)

After creating these indexes, wait a few minutes for them to build before trying the app again. 