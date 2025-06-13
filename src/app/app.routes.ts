import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NonAuthGuard } from './guards/non-auth.guard';
import { TodoListComponent } from './components/todos/todo-list.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [NonAuthGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
    canActivate: [NonAuthGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [NonAuthGuard]
  },
  { 
    path: 'app/new', 
    component: TodoListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'app', 
    component: TodoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'app/chat',
    loadComponent: () => import('./components/chat-interface/chat-interface.component').then(m => m.ChatInterfaceComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
