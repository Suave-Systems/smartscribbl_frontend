import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'otp',
        loadComponent: () =>
          import('./pages/auth/otp/otp.component').then((m) => m.OtpComponent),
      },
    ],
  },
];
