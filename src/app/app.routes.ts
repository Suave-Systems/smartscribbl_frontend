import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CompleteRegOneComponent } from './pages/auth/complete-reg-one/complete-reg-one.component';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';

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
      {
        path: 'complete-reg-one',
        loadComponent: () =>
          import(
            './pages/auth/complete-reg-one/complete-reg-one.component'
          ).then((m) => m.CompleteRegOneComponent),
        // canActivate: [authGuard],
      },
      {
        path: 'complete-reg-two',
        loadComponent: () =>
          import(
            './pages/auth/complete-reg-two/complete-reg-two.component'
          ).then((m) => m.CompleteRegTwoComponent),
        // canActivate: [authGuard],
      },
      {
        path: 'complete-reg-three',
        loadComponent: () =>
          import(
            './pages/auth/complete-reg-three/complete-reg-three.component'
          ).then((m) => m.CompleteRegThreeComponent),
        // canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'main',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        // canActivate: [authGuard],
      },
      // {
      //   path: 'subscription',
      //   loadComponent: () =>
      //     import('./pages/subscriptions/subscriptions.component').then(
      //       (m) => m.SubscriptionsComponent
      //     ),
      // },
      {
        path: 'subscription',
        loadComponent: () =>
          import(
            './pages/subscriptions/billing-history/billing-history.component'
          ).then((m) => m.BillingHistoryComponent),
      },
      {
        path: 'plugins',
        loadComponent: () =>
          import('./pages/plugins/plugins.component').then(
            (m) => m.PluginsComponent
          ),
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./pages/wallet/wallet.component').then(
            (m) => m.WalletComponent
          ),
      },
      {
        path: 'create-article',
        loadComponent: () =>
          import('./pages/article/article.component').then(
            (m) => m.ArticleComponent
          ),
      },
      {
        path: 'edit-article/:id',
        loadComponent: () =>
          import('./pages/article/article.component').then(
            (m) => m.ArticleComponent
          ),
      },
    ],
  },
];
