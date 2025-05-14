# Angular Firebase Todo App

A modern, responsive todo application built with Angular and Firebase. Features user authentication, real-time data synchronization, and a clean UI.

## Features

- **User Authentication**: Secure login and registration using Firebase Auth
- **Real-time Data**: Firestore database for instant updates across devices
- **Responsive Design**: Works on desktop and mobile devices
- **Task Management**: Create, read, update and delete tasks
- **Session Management**: Automatic session timeout for security

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI
- Firebase account

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/ashansenadheeralk/todo.git
   cd todo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   
   The app uses environment files for Firebase configuration. Create or modify the following files:

   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

   Each file should contain your Firebase project configuration:

   ```typescript
   export const environment = {
     production: false, // or true for environment.prod.ts
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     }
   };
   ```

   **Note**: Keep your Firebase configuration private and never commit actual API keys to public repositories.

4. Run the development server:
   ```
   ng serve
   ```

5. Open your browser to `http://localhost:4200/`

## Project Structure

- `src/app/components/` - UI components
- `src/app/services/` - Service classes for business logic and API integration
- `src/environments/` - Environment configuration files
- `src/assets/` - Static assets like images and styles

## Available Scripts

- `ng serve` - Run the development server
- `ng build` - Build the application
- `ng build --configuration production` - Build for production
- `ng test` - Run tests

## Technologies Used

- **Angular**: Frontend framework
- **Firebase Authentication**: User management
- **Firestore**: NoSQL database
- **Firebase Analytics**: Usage analytics

## Security Notes

- Environment files containing credentials are excluded from Git via `.gitignore`
- Session timeout implemented for security
- Firebase security rules should be configured for your project

## License

MIT
