import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { NotificationService } from '../../services/notification.service';
import { CurrencyPipe, NgClass, TitleCasePipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Plan } from '../../../models/api-responses';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [
    NgClass,
    ButtonComponent,
    MatDialogModule,
    FormsModule,
    TitleCasePipe,
    CurrencyPipe,
    EmptyStateComponent,
  ],
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.scss',
})
export class PlanListComponent {
  private subscriptions: Subscription[] = [];
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  private notify = inject(NotificationService);

  isLoading = signal(false);
  isSubscribing = signal(false);
  planList = signal<Plan[]>([]);

  selectedPlan: any;

  ngOnInit() {
    this.getPlanList();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  getPlanList() {
    this.isLoading.set(true);
    const sub = this.subscriptionService.getPlanList().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.planList.set(res);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    this.subscriptions.push(sub);
  }

  onSubscribe() {
    if (!this.selectedPlan) {
      this.notify.error(
        'Please select a plan to subscribe',
        'No Plan Selected'
      );
      return;
    }
    this.isSubscribing.set(true);
    const domain = window.location.origin;
    this.paymentService
      .subscribe({
        plan: this.selectedPlan,
        callback_url: `${domain}/main/subscription`,
      })
      .subscribe({
        next: (res: {
          code: string;
          status: string;
          authorization_url: string;
        }) => {
          // todo: redirect the user to authorization_url
          window.location.href = res?.authorization_url;
          this.isSubscribing.set(false);
        },
        error: (err) => {
          this.isSubscribing.set(false);
          this.notify.error(err.error.message, 'Unable to subscribe');
        },
      });
  }
}
