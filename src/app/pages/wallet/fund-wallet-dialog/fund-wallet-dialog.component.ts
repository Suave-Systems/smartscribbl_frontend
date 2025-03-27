import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-fund-wallet-dialog',
  standalone: true,
  imports: [ButtonComponent, MatDialogClose],
  templateUrl: './fund-wallet-dialog.component.html',
  styleUrl: './fund-wallet-dialog.component.scss',
})
export class FundWalletDialogComponent {}
