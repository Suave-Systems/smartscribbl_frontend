import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HelperService } from '../../shared/services/helper.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  // passwordForm: FormGroup = new FormGroup({});
  passwordForm!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);
  hide = true;

  private authService = inject(AuthService);
  private helperService = inject(HelperService);
  private router = inject(Router);
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.passwordForm = this.fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: this.helperService.passwordMatch(
          'new_password',
          'confirm_password'
        ),
      }
    );
  }

  get old_password() {
    return this.passwordForm.get('old_password') as FormControl;
  }

  get new_password() {
    return this.passwordForm.get('new_password') as FormControl;
  }
  get confirm_password() {
    return this.passwordForm.get('confirm_password') as FormControl;
  }

  onSetNewPassword() {
    console.log(this.passwordForm);
    if (this.passwordForm.hasError('passwordMismatch')) {
      this.notificationService.error('Passwords do not match.');
      return;
    }
    if (this.passwordForm.invalid) {
      this.notificationService.error('Please fill in all required fields.');
      return;
    }
    this.isLoading.set(true);

    this.authService.setNewPassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/main/dashboard']);
        this.notificationService.success(
          'Password change successful',
          'success'
        );
      },
    });
  }
}
