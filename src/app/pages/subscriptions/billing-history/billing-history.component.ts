import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [PageTitleComponent, ButtonComponent],
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
})
export class BillingHistoryComponent {}
