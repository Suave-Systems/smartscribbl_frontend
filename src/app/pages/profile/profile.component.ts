import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  errorMessage = '';
  isLoading = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });

    this.getUser();
  }

  get first_name() {
    return this.form.get('first_name') as FormControl;
  }

  get last_name() {
    return this.form.get('last_name') as FormControl;
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  getUser(): void {
    this.authService.getUser().subscribe((user: any) => {
      const { email, id, first_name, last_name, is_active } = user;
      this.form.patchValue({
        email: email,
        id: id,
        first_name: first_name,
        last_name: last_name,
      });
      this.form.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.error('Please fill in all required fields.');
      return;
    }
    this.isLoading.set(true);
    const { first_name, last_name, id } = this.form.value;
    this.authService.updateUser({ first_name, last_name, id }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/main/dashboard']);
      },
    });
  }
}
