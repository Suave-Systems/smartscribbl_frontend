import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DialogService } from '../../shared/services/dialog.service';
import { FundWalletDialogComponent } from './fund-wallet-dialog/fund-wallet-dialog.component';
import { noop, Subscription } from 'rxjs';
import { PaymentService } from '../../shared/services/payment.service';
import {
  BalanceResponse,
  TransactionHistoryResponse,
} from '../../models/api-responses';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    PageTitleComponent,
    ButtonComponent,
    EmptyStateComponent,
    CurrencyPipe,
    DatePipe,
    NgClass,
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private paymentService = inject(PaymentService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  balanceLoading = signal(false);
  transactionHistory = signal<TransactionHistoryResponse[]>([]);
  balance = signal<BalanceResponse | null | undefined>(undefined);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getWalletBalance();
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params && params.has('reference')) {
        const txRef = params.get('reference') as string;
        this.paymentService.verifyPayments(txRef).subscribe({
          complete: () => {
            this.notify.info(
              'Hang on, we are verifying the status of your transaction',
              'Verifying Transaction'
            );
            this.getPaymentList();
          },
        });
        return;
      }
      this.getPaymentList();
    });
  }

  ngOnDestroy() {
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getWalletBalance() {
    this.balanceLoading.set(true);
    const sub = this.paymentService.getWalletBalance().subscribe({
      next: (res) => {
        this.balanceLoading.set(false);
        if (res.code === 200) {
          this.balance.set(res.data);
        }
      },
      error: (err) => {
        this.balanceLoading.set(false);
        this.balance.set(null);
      },
    });
    this.subscriptions.push(sub);
  }

  getPaymentList() {
    this.isLoading.set(true);
    const sub = this.paymentService.getPayments({}).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.transactionHistory.set(res.results);
      },
      error: () => {
        this.isLoading.set(false);
        this.transactionHistory.set([]);
      },
    });

    this.subscriptions.push(sub);
  }

  onFundWallet() {
    this.dialogService.openDialog(FundWalletDialogComponent, {
      panelClass: 'wallet-dialog',
      autoFocus: false,
      data: {
        balance: this.balance(),
      },
    });
  }
}
