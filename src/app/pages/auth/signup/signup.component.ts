import { Component, inject } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signUpForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  errorMessage = '';

  ngOnInit() {
    this.signUpForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      password: [''],
    });
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
    this.errorMessage = '';
    // Call API to sign up
    if (this.signUpForm.invalid) {
      return;
    }
    this.authService.signUp(this.signUpForm.value).subscribe({
      error: (err) => {
        this.errorMessage = err.error.detail;
      },
    });
  }
}
