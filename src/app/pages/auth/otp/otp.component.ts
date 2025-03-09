import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterLink,
    NgOtpInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent implements OnInit {
  otp = new FormControl('', [Validators.required]);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  errormessage = '';
  mode: 'login' | 'signup' = 'login';

  ngOnInit(): void {
    this.getMode();
    this.otp.valueChanges.subscribe((value) => {
      if (value && value.length === 6) {
        this.onVerify();
      }
    });
  }

  getMode() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('mode')) {
        const mode = params.get('mode') as any;
        this.mode = mode;
      }
    });
  }

  onVerify() {
    if (this.otp.invalid) {
      // this.helperService.validateAllFormFields(this.otp)
      return;
    }
    console.log(this.mode);

    this.mode === 'login' ? this.onLoginVerify() : this.onSignupVerify();
  }

  onSignupVerify() {
    this.authService
      .verifyEmail({ otp_code: this.otp.value as string })
      .subscribe({
        error: (err) => {
          this.errormessage = err.error.details;
        },
      });
  }
  onLoginVerify() {
    this.authService
      .verifyLogin({ otp_code: this.otp.value as string })
      .subscribe({
        error: (err) => {
          this.errormessage = err.error.details;
        },
      });
  }
}
