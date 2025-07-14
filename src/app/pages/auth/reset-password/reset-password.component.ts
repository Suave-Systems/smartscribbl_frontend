import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../shared/services/helper.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NgOtpInputComponent } from 'ng-otp-input';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    NgOtpInputComponent,
    ButtonComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  isLoading = signal(false);
  otp = true; // Set to true to show OTP input

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private helperService = inject(HelperService);
  private router = inject(Router);
  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.form = this.fb.group(
      {
        otp_code: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validators: this.helperService.passwordMatch(
          'password',
          'confirm_password'
        ),
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get otp_code() {
    return this.form.get('otp_code') as FormControl;
  }
  get password() {
    return this.form.get('password') as FormControl;
  }
  get confirm_password() {
    return this.form.get('confirm_password') as FormControl;
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading.set(true);
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      this.isLoading.set(false);
      return;
    }
    const sub = this.authService.resetPassword(this.form.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.notificationService.success(
          'Password reset successful',
          'Success'
        );
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error.message;
      },
    });

    this.subscriptions.push(sub);
  }
}
