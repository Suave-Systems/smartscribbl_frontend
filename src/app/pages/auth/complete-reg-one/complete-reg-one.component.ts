import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-complete-reg-one',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './complete-reg-one.component.html',
  styleUrl: './complete-reg-one.component.scss',
})
export class CompleteRegOneComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  options = signal<{ id: number; intention: string }[]>([]);
  selectedOptions = signal<string[]>([]);
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);
  private customer_meta: any;

  private subscriptions: Subscription[] = [];
  private router = inject(Router);

  ngOnInit() {
    this.getOptions();
    this.getUserMetaData();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private getOptions() {
    const sub = this.authService.getWritingIntentions().subscribe({
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
          if (res.writing_intention && res.writing_intention.length > 0) {
            this.selectedOptions.set(res.writing_intention);
          }
        },
        error: () => {},
      });
    this.subscriptions.push(sub);
  }

  toggleSelection(optionId: string) {
    const updatedSelections = [...this.selectedOptions()];
    const index = updatedSelections.indexOf(optionId);

    if (index > -1) {
      updatedSelections.splice(index, 1);
    } else {
      updatedSelections.push(optionId);
    }

    this.selectedOptions.set(updatedSelections);
  }

  onSave() {
    this.errorMessage.set('');
    this.isSaving.set(true);
    this.createUserMetadata();
  }

  private createUserMetadata() {
    this.customer_meta = {
      ...this.customer_meta,
      writing_intention: [...this.selectedOptions()],
    };
    const sub = this.authService.postUserMeta(this.customer_meta).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate([`/auth/complete-reg-two`]);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error.detail || 'An unknown error occurred');
      },
    });
    this.subscriptions.push(sub);
  }
}
