import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PaymentService } from '../../../shared/services/payment.service';
import { BillingHistoryResponse } from '../../../models/api-responses';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../../../shared/services/dialog.service';
import { PlanListComponent } from '../../../shared/components/plan-list/plan-list.component';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [
    PageTitleComponent,
    ButtonComponent,
    EmptyStateComponent,
    NgClass,
    MatMenuModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
})
export class BillingHistoryComponent implements OnInit, OnDestroy {
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  private dialogService = inject(DialogService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  billingHistoryList = signal<BillingHistoryResponse[]>([]);
  currentPlan = signal<BillingHistoryResponse | null | undefined>(null);
  planList = signal<any[]>([]);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getCurrentPlan();
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params && params.has('reference')) {
        const txRef = params.get('reference') as string;
        this.paymentService.verifyPayments(txRef).subscribe({
          complete: () => {
            this.notify.info(
              'Hang on, we are verifying the status of your payment',
              'Verifying Payment'
            );
            this.getBillingHistoryList();
          },
        });
        return;
      }
      this.getBillingHistoryList();
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getBillingHistoryList() {
    this.isLoading.set(true);
    const sub = this.subscriptionService.getSubscriptionList({}).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.billingHistoryList.set(res.results);
      },
      error: () => {
        this.isLoading.set(false);
        this.billingHistoryList.set([]);
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

  onCancelSubscription() {
    if (this.currentPlan() && this.currentPlan()?.id) {
      const currentPlanId = this.currentPlan()?.id as number;
      const sub = this.subscriptionService
        .cancelSubscription(currentPlanId)
        .subscribe({
          next: (res: any) => {
            // notify user of successful sub and refresh list
            this.getCurrentPlan();
            this.notify.success(res?.message);
          },
          error: (err) => {
            this.notify.error(err?.error?.message);
            // notify user that cancel failed
          },
        });
      this.subscriptions.push(sub);
    }
  }

  onOpenPlansDialog() {
    this.dialogService.openDialog(PlanListComponent, {});
  }
}
