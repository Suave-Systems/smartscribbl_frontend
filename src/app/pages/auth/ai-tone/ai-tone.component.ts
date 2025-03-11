import { Component, inject, signal } from '@angular/core';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-ai-tone',
  standalone: true,
  imports: [
    RouterLink,
    MatDialogContent,
    MatDialogClose,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './ai-tone.component.html',
  styleUrl: './ai-tone.component.scss',
})
export class AiToneComponent {
  options = signal<{ id: number; tone: string }[]>([]);
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);
  private customer_meta: any;
  form!: FormGroup;

  private subscriptions: Subscription[] = [];
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private dialogRef: MatDialogRef<AiToneComponent>) {}

  ngOnInit() {
    this.getOptions();
    this.getUserMetaData();
    this.form = this.fb.group({
      ai_custom_name: [null, [Validators.required]],
      ai_tone: [null, [Validators.required]],
      ai_trait_description: [null, [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Getters for form controls
  get aiCustomName() {
    return this.form.get('ai_custom_name') as FormControl;
  }

  get aiTone() {
    return this.form.get('ai_tone') as FormControl;
  }

  get aiTraitDescription() {
    return this.form.get('ai_trait_description') as FormControl;
  }

  private getOptions() {
    const sub = this.authService.getAiTone().subscribe({
      next: (res: any) => this.options.set(res.reverse()),
      error: () => this.errorMessage.set('Failed to load options'),
    });
    this.subscriptions.push();
  }

  private getUserMetaData() {
    const sub = this.authService
      .getUserMetaDataById(this.authService.getUserId())
      .subscribe({
        next: (res: any) => {
          this.customer_meta = res;
          this.form.patchValue(res);
          this.form.updateValueAndValidity();
        },
        error: () => {},
      });
    this.subscriptions.push(sub);
  }

  toggleSelection(optionId: string) {
    this.aiTone.patchValue(optionId);
    this.aiTone.updateValueAndValidity();
  }
  createUserMetadata() {
    this.customer_meta = {
      ...this.customer_meta,
      ...this.form.value,
    };

    const sub = this.authService.postUserMeta(this.customer_meta).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate([`/main/dashboard`]);
        this.dialogRef.close();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error.detail || 'An unknown error occurred');
      },
    });
    this.subscriptions.push(sub);
  }
}
