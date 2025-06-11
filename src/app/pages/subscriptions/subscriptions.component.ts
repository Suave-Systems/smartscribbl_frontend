import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../shared/services/payment.service';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';
import { BillingHistoryResponse } from '../../models/api-responses';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DecimalPipe,
    PageTitleComponent,
    ButtonComponent,
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  private notify = inject(NotificationService);

  isLoading = signal(false);
  planList = signal<any[]>([]);
  currentPlan = signal<BillingHistoryResponse | null>(null);
  yearly = false;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getCurrentPlan();
    this.getPlanList();
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getPlanList() {
    this.isLoading.set(true);
    const sub = this.subscriptionService.getPlanList().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.planList.set(res as any[]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    this.subscriptions.push(sub);
  }

  getCurrentPlan() {
    const sub = this.subscriptionService.getCurrentPlan().subscribe({
      next: (res) => {
        this.currentPlan.set(res.data);
      },
    });
    this.subscriptions.push(sub);
  }

  cancelSubscription(planId: number) {
    const sub = this.subscriptionService.cancelSubscription(planId).subscribe({
      next: (res) => {
        // notify user of successful sub and refresh list
        this.getCurrentPlan();
      },
      error: (err) => {
        // notify user that cancel failed
      },
    });

    this.subscriptions.push(sub);
  }

  onSubscribe(plan: string) {
    this.paymentService
      .subscribe({
        plan,
        callback_url: 'http://localhost:4200/main/subscription/billing-history',
        number_of_months: this.yearly ? 12 : 1,
      })
      .subscribe({
        next: (res: {
          code: string;
          status: string;
          authorization_url: string;
        }) => {
          // todo: redirect the user to authorization_url
          window.location.href = res?.authorization_url;
        },
        error: (err) => {
          this.notify.error(err.error.message, 'Unable to subscribe');
        },
      });
  }
}
