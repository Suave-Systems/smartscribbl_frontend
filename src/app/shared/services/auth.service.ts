import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  verifyEmailRequest,
} from '../../core/models/auth/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CookiesService } from './cookies.service';
import { NotificationService } from './notification.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private router = inject(Router);
  private http = inject(HttpClient);
  private cookieService = inject(CookiesService);
  private toastr = inject(NotificationService);
  private signupSubject = new Subject<any>();
  private loginSubject = new Subject<any>();
  private verifyEmailSubject = new Subject<any>();
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  login(payload: LoginRequest) {
    // const responseSubject = new Subject<any>();
    this.http
      .post<LoginResponse>(`${this.baseUrl}auth/v1/login`, payload)
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'SUCCESS');
          // this.router.navigate(['/auth/otp'], {
          //   queryParams: { mode: 'login' },
          // });
          this.handleToken(res);
          this.loginSubject.complete();
        },
        error: (err) => {
          this.loginSubject.error(err);
          this.toastr.error(err.error.message, 'Error');
        },
      });

    return this.loginSubject.asObservable();
  }

  verifyLogin(payload: verifyEmailRequest) {
    this.http.post(`${this.baseUrl}auth/v1/login/verify/`, payload).subscribe({
      next: (res: any) => {
        this.handleToken(res);
      },
      error: (err) => {
        this.verifyEmailSubject.error(err);
        this.toastr.error(err.error.message, 'Error');
      },
    });

    return this.verifyEmailSubject.asObservable();
  }

  handleToken(res: any) {
    if (res.code === 200) {
      if (res.token && res.token.access) {
        // Store JWT token in local storage or session storage
        this.cookieService.set(
          this.cookieService.COOKIE_NAME,
          res.token.access
        );
        this.cookieService.set('refreshToken', res.token.refresh);
        const decodedToken: any = jwtDecode(res.token.access);
        this.cookieService.set('userId', decodedToken.user_id);
        this.loginSubject.next(res);
        this.loginSubject.complete();
        // this.router.navigate(['/main/dashboard']);
      }
    } else {
      this.loginSubject.error(res);
      const message: string = res.message || 'An Unknown error Occurred';
      this.toastr.error(message, 'Error');
    }
  }

  logout(): void {
    this.cookieService.clearAll();
    this.isAuthenticated.next(false);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getToken(): string | null {
    return this.cookieService.get(this.cookieService.COOKIE_NAME);
  }

  getUserId(): string | null {
    return this.cookieService.get('userId');
  }

  private hasToken(): boolean {
    return !!this.cookieService.get(this.cookieService.COOKIE_NAME);
  }

  signUp(payload: SignupRequest) {
    this.http
      .post<SignupResponse>(`${this.baseUrl}auth/v1/customer/user/`, payload)
      .subscribe({
        next: (res) => {
          if (res.code === 201) {
            this.router.navigate(['/auth/otp'], {
              queryParams: { mode: 'signup', otp: res.otp },
            });
            this.toastr.success(res.message, 'Success');
            this.signupSubject.complete();
          } else {
            this.signupSubject.error(res);
            const message: string = res.message || 'An Unknown error Occurred';
            this.toastr.error(message, 'Error');
          }
        },
        error: (err) => {
          this.signupSubject.error(err);
          this.toastr.error(err.error.message, 'Error');
        },
      });

    return this.signupSubject.asObservable();
  }

  verifyEmail(payload: verifyEmailRequest) {
    this.http.post(`${this.baseUrl}auth/v1/verify-otp/`, payload).subscribe({
      next: (res: any) => {
        this.handleToken(res);
      },
      error: (err) => {
        this.verifyEmailSubject.error(err);
        this.toastr.error(err.error.message, 'Error');
      },
    });

    return this.verifyEmailSubject.asObservable();
  }

  getWritingIntentions() {
    return this.http.get(
      `${this.baseUrl}onboarding/v1/writing-intention/?only_active=true`
    );
  }

  getPrimaryJobRole() {
    return this.http.get<any[]>(
      `${this.baseUrl}onboarding/v1/primary-job-field/?only_active=true`
    );
  }

  getJobRole() {
    return this.http.get<any[]>(
      `${this.baseUrl}onboarding/v1/job-role/?only_active=true`
    );
  }

  getSuggestedHelp() {
    return this.http.get(
      `${this.baseUrl}onboarding/v1/suggested-help/?only_active=true`
    );
  }

  getAiTone() {
    return this.http.get(
      `${this.baseUrl}onboarding/v1/ai-tone/?only_active=true`
    );
  }

  postUserMeta(payload: any): Observable<any> {
    const responseSubject = new Subject<any>(); // Create a fresh subject per request

    this.http
      .post(`${this.baseUrl}users/v1/customer-metadata/`, payload)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Got it! Your writing focus is set.', 'Success');
          // this.router.navigate([`/auth/complete-reg-${nextStep}`]);
          responseSubject.next(res);
          responseSubject.complete(); // COMPLETE the observable
        },
        error: (err) => {
          this.toastr.error(
            err.error.message || 'An unknown error occurred',
            'Error'
          );
          responseSubject.error(err);
        },
      });

    return responseSubject.asObservable();
  }

  getUserMetaDataById(userId: any) {
    return this.http.get(`${this.baseUrl}users/v1/customer-metadata/me/`);
  }

  updateUserMetaDataById(payload: any) {
    const responseSubject = new Subject<any>();
    this.http
      .put(`${this.baseUrl}users/v1/customer-metadata/${payload.id}`, payload)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.router.navigate(['/auth/complete-reg-two']);
            responseSubject.next(res);
            responseSubject.complete();
          } else {
            responseSubject.error(res);
            const message: string = res.message || 'An Unknown error Occurred';
            this.toastr.error(message, 'Error');
          }
        },
        error: (err) => {
          responseSubject.error(err);
          this.toastr.error(err.error.message, 'Error');
        },
      });

    return responseSubject.asObservable();
  }
}
