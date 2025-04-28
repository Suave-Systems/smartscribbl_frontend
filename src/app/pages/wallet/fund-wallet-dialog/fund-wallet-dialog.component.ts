import { Component, Inject, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../shared/services/payment.service';
import { CurrencyPipe } from '@angular/common';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-fund-wallet-dialog',
  standalone: true,
  imports: [ButtonComponent, MatDialogClose, FormsModule, CurrencyPipe],
  templateUrl: './fund-wallet-dialog.component.html',
  styleUrl: './fund-wallet-dialog.component.scss',
})
export class FundWalletDialogComponent {
  private paymentService = inject(PaymentService);
  private notify = inject(NotificationService);

  public data = inject(MAT_DIALOG_DATA);
  amount = '0.00';
  isLoading = signal(false);

  onFundWallet() {
    this.isLoading.set(true);
    this.paymentService
      .fundWallet({
        amount: this.amount,
        callback_url: 'http://localhost:4200/main/wallet',
      })
      .subscribe({
        next: (res: {
          code: string;
          status: string;
          authorization_url: string;
        }) => {
          console.log(res);

          // todo: redirect the user to authorization_url
          window.location.href = res?.authorization_url;
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notify.error(err.error.message);
        },
      });
  }
}
