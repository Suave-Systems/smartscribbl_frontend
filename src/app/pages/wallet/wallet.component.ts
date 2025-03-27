import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DialogService } from '../../shared/services/dialog.service';
import { FundWalletDialogComponent } from './fund-wallet-dialog/fund-wallet-dialog.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [PageTitleComponent, ButtonComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent {
  private dialogService = inject(DialogService);

  onFundWallet() {
    this.dialogService.openDialog(FundWalletDialogComponent, {
      panelClass: 'wallet-dialog',
      autoFocus: false,
    });
  }
}
