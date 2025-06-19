import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { HelperService } from '../../../shared/services/helper.service';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { AiToneComponent } from '../ai-tone/ai-tone.component';

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
  private dialogService = inject(DialogService);
  private router = inject(Router);
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

  private getUserMetaData() {
    const sub = this.authService
      .getUserMetaDataById(this.authService.getUserId())
      .subscribe({
        next: (res: any) => {
          if (res.writing_intention && res.writing_intention.length === 0) {
            this.router.navigate(['/auth/complete-reg-one']);
          } else if (!(res.job_role && res.primary_job_field)) {
            this.router.navigate(['/auth/complete-reg-two']);
          } else if (res.suggested_help && res.suggested_help === 0) {
            this.router.navigate(['/auth/complete-reg-three']);
          } else if (
            !res.ai_tone ||
            !res.ai_custom_name ||
            !res.ai_trait_description
          ) {
            this.router.navigate(['/main/dashboard']);
            this.dialogService.openDialog(AiToneComponent, { width: '640px' });
          } else {
            this.router.navigate(['/main/dashboard']);
          }
        },
        error: (err) => {
          this.router.navigate(['/auth/complete-reg-one']);
        },
      });
    this.subscriptions.push(sub);
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
      next: (res) => {
        this.isLoading.set(false);
        this.getUserMetaData();
        // this.helperService.navigateToDashboard();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error.message;
      },
    });

    this.subscriptions.push(sub);
  }
}
