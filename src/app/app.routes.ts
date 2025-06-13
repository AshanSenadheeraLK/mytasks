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
 owoaq7-codex/implement-ai-agent-for-task-management
    path: 'app/chat',

    path: 'chat',
 v2
    loadComponent: () => import('./components/task-chat/task-chat.component').then(m => m.TaskChatComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
