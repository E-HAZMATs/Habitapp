import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard', //TODOIMP: Implement a guard for dashboard to take u to login if not authed.
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'habit-logs',
    loadComponent: () => import('./features/habit/habit-logs/habit-logs.component').then(m => m.HabitLogsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];