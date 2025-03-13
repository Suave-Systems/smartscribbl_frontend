import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { HelperService } from '../../../shared/services/helper.service';

@Component({
  selector: 'app-complete-reg-two',
  standalone: true,
  imports: [ButtonComponent, SelectComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './complete-reg-two.component.html',
  styleUrl: './complete-reg-two.component.scss',
})
export class CompleteRegTwoComponent {
  errorMessage = '';
  roles: any = [];
  primaryRoles: any = [];
  form!: FormGroup;
  customer_meta: any;
  isLoading = signal(false);

  private helperService = inject(HelperService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.form = this.fb.group({
      primary_job_field: [null, [Validators.required]],
      job_role: [null, [Validators.required]],
    });
    this.getJobRoles();
    this.getPrimaryRoles();
    this.getUserMetaData();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get primary_job_field() {
    return this.form.get('primary_job_field') as FormControl;
  }

  get job_role() {
    return this.form.get('job_role') as FormControl;
  }

  getPrimaryRoles() {
    const sub = this.authService.getPrimaryJobRole().subscribe({
      next: (res: any[]) => {
        this.primaryRoles = res.map((element) => {
          return { label: element.field, value: element.id, ...element };
        });
      },
    });

    this.subscriptions.push(sub);
  }

  getJobRoles() {
    const sub = this.authService.getJobRole().subscribe({
      next: (res: any[]) => {
        this.roles = res.map((element) => {
          return { label: element.role, value: element.id, ...element };
        });
      },
    });

    this.subscriptions.push(sub);
  }

  private getUserMetaData() {
    const sub = this.authService
      .getUserMetaDataById(this.authService.getUserId())
      .subscribe({
        next: (res: any) => {
          this.customer_meta = res;
          this.form.patchValue(res);
        },
        error: () => {},
      });
    this.subscriptions.push(sub);
  }

  onSave() {
    this.errorMessage = '';
    // if (this.form.invalid) {
    //   this.helperService.validateAllFormFields(this.form);
    //   this.errorMessage = 'one or more input fields are invalid';
    //   return;
    // }
    this.isLoading.set(true);
    const data = { ...this.customer_meta, ...this.form.value };

    const sub = this.authService.postUserMeta(data).subscribe({
      next: () => {
        this.notification.success(
          `Thanks! We’ve noted your expertise.`,
          'SUCCESS'
        );
        this.router.navigate(['/auth/complete-reg-three']);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    this.subscriptions.push(sub);
  }
}
