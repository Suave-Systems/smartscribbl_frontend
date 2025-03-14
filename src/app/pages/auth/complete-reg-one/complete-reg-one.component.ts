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
  options = signal<{ id: number; intention: string }[]>([]);
  selectedOptions = signal<string[]>([]);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  private customer_meta: any;

  private authService = inject(AuthService);
  private router = inject(Router);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.isLoading.set(true);
    this.getOptions();
    this.getUserMetaData();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private getOptions() {
    const sub = this.authService.getWritingIntentions().subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.options.set(res.reverse());
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load writing intentions');
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
          if (res.writing_intention && res.writing_intention.length > 0) {
            this.selectedOptions.set(res.writing_intention);
          }
        },
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
    this.selectedOptions().length > 0
      ? this.createUserMetadata()
      : this.errorMessage.set('You must select at least 1 writing intention');
  }

  private createUserMetadata() {
    this.isLoading.set(true);
    this.customer_meta = {
      ...this.customer_meta,
      writing_intention: [...this.selectedOptions()],
    };
    const sub = this.authService.postUserMeta(this.customer_meta).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate([`/auth/complete-reg-two`]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error.message || 'An unknown error occurred');
      },
    });
    this.subscriptions.push(sub);
  }
}
