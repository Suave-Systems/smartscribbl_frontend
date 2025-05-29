import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { HelperService } from '../../../shared/services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private helperService = inject(HelperService);

  private subscriptions: Subscription[] = [];
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // email: ['customer@example.com', [Validators.required]],
      // password: ['Customer@2025', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  onLogin() {
    this.errorMessage = '';
    this.isLoading.set(true);
    if (this.loginForm.invalid) {
      this.helperService.validateAllFormFields(this.loginForm);
      this.isLoading.set(false);
      return;
    }
    const sub = this.authService.login(this.loginForm.value).subscribe({
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error.message;
      },
    });

    this.subscriptions.push(sub);
  }
}
