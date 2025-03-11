import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { AiToneComponent } from '../ai-tone/ai-tone.component';
import { DialogService } from '../../../shared/services/dialog.service';

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
  private router = inject(Router);
  private dialogService = inject(DialogService);
  errormessage = '';
  mode: 'login' | 'signup' = 'login';

  private subscriptions: Subscription[] = [];

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

  onVerify() {
    if (this.otp.invalid) {
      // this.helperService.validateAllFormFields(this.otp);
      this.errormessage = '';
      return;
    }

    const sub =
      this.mode === 'login' ? this.onLoginVerify() : this.onSignupVerify();
    sub.subscribe({
      next: () => {
        this.getUserMetaData();
      },
      error: (err) => {
        this.errormessage = err.error.details;
      },
    });
  }

  onSignupVerify() {
    return this.authService.verifyEmail({ otp_code: this.otp.value as string });
    // .subscribe({
    //   error: (err) => {
    //     this.errormessage = err.error.details;
    //   },
    // });
  }
  onLoginVerify() {
    return this.authService.verifyLogin({ otp_code: this.otp.value as string });
    // .subscribe({
    //   error: (err) => {
    //     this.errormessage = err.error.details;
    //   },
    // });
  }
}
