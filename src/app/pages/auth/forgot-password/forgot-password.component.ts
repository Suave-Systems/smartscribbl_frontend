import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { HelperService } from '../../../shared/services/helper.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ButtonComponent, RouterLink, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  errorMessage = '';
  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private helperService = inject(HelperService);
  private router = inject(Router);
  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading.set(true);
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      this.isLoading.set(false);
      return;
    }
    const sub = this.authService.forgotPassword(this.form.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.notificationService.success('OTP sent to your email', 'Success');
        this.router.navigate(['/auth/reset-password']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error.message;
      },
    });

    this.subscriptions.push(sub);
  }
}
