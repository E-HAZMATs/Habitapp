import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { alreadyAuthenticatedGuard } from './core/guards/already-authenticated-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [alreadyAuthenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.Register)
      },

    ]
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