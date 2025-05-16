import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { TodoListComponent } from './components/todos/todo-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { 
    path: 'app', 
    component: TodoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
