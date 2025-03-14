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
  selector: 'app-signup',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  errorMessage = '';
  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private helperService = inject(HelperService);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.signUpForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get firstName() {
    return this.signUpForm.get('first_name') as FormControl;
  }
  get lastName() {
    return this.signUpForm.get('last_name') as FormControl;
  }
  get email() {
    return this.signUpForm.get('email') as FormControl;
  }
  get password() {
    return this.signUpForm.get('password') as FormControl;
  }

  signUp() {
    this.isLoading.set(true);
    this.errorMessage = '';
    // Call API to sign up
    if (this.signUpForm.invalid) {
      this.isLoading.set(false);
      this.helperService.validateAllFormFields(this.signUpForm);
      return;
    }
    const sub = this.authService.signUp(this.signUpForm.value).subscribe({
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error.message;
      },
    });
    this.subscriptions.push(sub);
  }
}
