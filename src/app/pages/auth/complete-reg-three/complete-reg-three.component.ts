import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { AiToneComponent } from '../ai-tone/ai-tone.component';

@Component({
  selector: 'app-complete-reg-three',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './complete-reg-three.component.html',
  styleUrl: './complete-reg-three.component.scss',
})
export class CompleteRegThreeComponent {
  options = signal<{ id: number; suggestion: string }[]>([]);
  selectedOptions = signal<number[]>([]);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  customer_meta: any;

  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getOptions();
    this.getUserMetaData();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getOptions() {
    this.authService.getSuggestedHelp().subscribe({
      next: (res: any) => this.options.set(res.reverse()),
      error: () => this.errorMessage.set('Failed to load options'),
    });
  }

  toggleSelection(optionId: number) {
    const updatedSelections = [...this.selectedOptions()];
    const index = updatedSelections.indexOf(optionId);

    if (index > -1) {
      updatedSelections.splice(index, 1);
    } else {
      updatedSelections.push(optionId);
    }

    this.selectedOptions.set(updatedSelections);
  }

  private getUserMetaData() {
    const sub = this.authService
      .getUserMetaDataById(this.authService.getUserId())
      .subscribe({
        next: (res: any) => {
          this.customer_meta = res.suggested_help;
          if (res.suggested_help && res.suggested_help.length > 0) {
            this.selectedOptions.set(res.writing_intention);
          }
        },
        error: () => {},
      });
    this.subscriptions.push(sub);
  }

  onSave() {
    this.errorMessage.set('');
    if (this.selectedOptions.length === 0) {
      this.errorMessage.set('Kindly select from the choices below');
      return;
    }
    this.isLoading.set(true);
    this.customer_meta = {
      ...this.customer_meta,
      suggested_help: [...this.selectedOptions()],
    };
    const sub = this.authService.postUserMeta(this.customer_meta).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/main/dashboard']);
        this.dialogService.openDialog(AiToneComponent, { width: '640px' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error.message || 'An unknown error occurred');
      },
    });
    this.subscriptions.push(sub);
  }
}
