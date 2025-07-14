import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { inject } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { CookiesService } from '../../shared/services/cookies.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notify = inject(NotificationService);
  const cookieService = inject(CookiesService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle client-side or network error
      if (error.error instanceof ErrorEvent) {
        notify.error(
          error.error.message || 'Kindly check your network and try again',
          'No Internet Connection'
        );
        return throwError(() => error);
      }

      // Handle 401 Unauthorized
      if (error.status === 401) {
        const refreshToken = cookieService.get('refreshToken');
        if (!refreshToken) {
          notify.error(
            'Session expired. Please log in again.',
            'Authentication Error'
          );
          authService.logout();
          return throwError(() => error);
        }

        // Attempt to refresh token
        return authService.refreshToken(refreshToken).pipe(
          switchMap((newToken: { access: string }) => {
            authService.setToken(newToken.access); // Save new token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.access}`,
              },
            });
            return next(clonedReq); // Retry original request
          }),
          catchError((refreshError) => {
            notify.error(
              'Session expired. Please log in again.',
              'Authentication Error'
            );
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Other server-side errors
      const errorMessage = error.error?.message || 'An error occurred';
      notify.error(errorMessage, `Error ${error.status}`);
      return throwError(() => error);
    })
  );
};
