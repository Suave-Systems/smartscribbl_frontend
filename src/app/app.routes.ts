import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

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
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
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
    path: 'main/create-article',
    loadComponent: () =>
      import('./pages/article-html/article-html.component').then(
        (m) => m.ArticleHtmlComponent
      ),
  },
  {
    path: 'main/edit-article/:id',
    loadComponent: () =>
      import('./pages/article-html/article-html.component').then(
        (m) => m.ArticleHtmlComponent
      ),
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
        path: 'user-profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./pages/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent
          ),
      },
      // {
      //   path: 'subscription',
      //   loadComponent: () =>
      //     import('./pages/subscriptions/subscriptions.component').then(
      //       (m) => m.SubscriptionsComponent
      //     ),
      // },

      // {
      //   path: 'create-test-article',
      //   loadComponent: () =>
      //     import('./pages/article-html/article-html.component').then(
      //       (m) => m.ArticleHtmlComponent
      //     ),
      // },
      // {
      //   path: 'edit-test-article/:id',
      //   loadComponent: () =>
      //     import('./pages/article-html/article-html.component').then(
      //       (m) => m.ArticleHtmlComponent
      //     ),
      // },
    ],
  },
];
