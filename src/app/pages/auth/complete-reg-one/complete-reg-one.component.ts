import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NgFor } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-complete-reg-one',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './complete-reg-one.component.html',
  styleUrl: './complete-reg-one.component.scss',
})
export class CompleteRegOneComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  options = signal<{ id: number; intention: string }[]>([]);
  selectedOptions = signal(new Set<number>());
  private mode = signal<'new' | 'edit'>('new');
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);

  private subscriptions: Subscription[] = [];

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
        next: (res: any) => this.mode.set(res.code === 200 ? 'new' : 'edit'),
        error: () => this.mode.set('new'),
      });
    this.subscriptions.push(sub);
  }

  toggleSelection(optionId: number) {
    const updatedSelections = new Set(this.selectedOptions());
    updatedSelections.has(optionId)
      ? updatedSelections.delete(optionId)
      : updatedSelections.add(optionId);

    this.selectedOptions.set(updatedSelections);
  }

  onSave() {
    this.errorMessage.set('');
    this.isSaving.set(true);
    const action =
      this.mode() === 'new'
        ? this.createUserMetadata()
        : this.updateUserMetadata();
  }

  private createUserMetadata() {
    const sub = this.authService
      .postUserMeta({ writing_intention: [...this.selectedOptions()] })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(
            err.error.detail || 'An unknown error occurred'
          );
        },
      });
    this.subscriptions.push(sub);
  }

  private updateUserMetadata() {
    const sub = this.authService.updateUserMetaDataById('').subscribe({
      next: () => {
        this.isSaving.set(false);
        this.notification.success(
          'Got it! Your writing focus is set.',
          'SUCCESS'
        );
        this.router.navigate(['/auth/complete-reg-two']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error.detail);
      },
    });

    this.subscriptions.push(sub);
  }
}
