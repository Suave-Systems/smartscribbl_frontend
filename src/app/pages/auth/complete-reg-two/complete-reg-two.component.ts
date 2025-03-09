import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { SelectComponent } from '../../../shared/components/select/select.component';

@Component({
  selector: 'app-complete-reg-two',
  standalone: true,
  imports: [ButtonComponent, SelectComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './complete-reg-two.component.html',
  styleUrl: './complete-reg-two.component.scss',
})
export class CompleteRegTwoComponent {
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  errorMessage = '';
  private subscriptions: Subscription[] = [];
  roles: any = [];
  primaryRoles: any = [];

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      primary_job_field: [''],
      job_role: [''],
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
          return { label: element.field, ...element };
        });
      },
    });

    this.subscriptions.push(sub);
  }

  getJobRoles() {
    const sub = this.authService.getJobRole().subscribe({
      next: (res: any[]) => {
        this.roles = res.map((element) => {
          return { label: element.role, ...element };
        });
      },
    });

    this.subscriptions.push(sub);
  }

  private getUserMetaData() {
    const sub = this.authService
      .getUserMetaDataById(this.authService.getUserId())
      .subscribe({
        next: (res: any) => this.form.patchValue(res),
      });
    this.subscriptions.push(sub);
  }

  onSave() {
    const sub = this.authService.updateUserMetaDataById('').subscribe({
      next: () => {
        this.notification.success(
          `Thanks! We’ve noted your expertise.`,
          'SUCCESS'
        );
        this.router.navigate(['/auth/complete-reg-three']);
      },
    });

    this.subscriptions.push(sub);
  }
}
