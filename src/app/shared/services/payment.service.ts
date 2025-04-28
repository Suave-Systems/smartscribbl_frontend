import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponses,
  BalanceResponse,
  PaginatedResponse,
  TransactionHistoryResponse,
} from '../../models/api-responses';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getPayments(payload: any) {
    return this.http.get<PaginatedResponse<TransactionHistoryResponse>>(
      `${this.baseUrl}payments/v1/`
    );
  }

  getPaymentById(id: string) {
    return this.http.get(`${this.baseUrl}payments/v1/${id}/`);
  }

  subscribe(payload: any) {
    return this.http.post<{
      code: string;
      status: string;
      authorization_url: string;
    }>(`${this.baseUrl}payments/v1/subscribe/`, payload);
  }

  fundWallet(payload: any) {
    return this.http.post<{
      code: string;
      status: string;
      authorization_url: string;
    }>(`${this.baseUrl}payments/v1/topup/`, payload);
  }

  getWalletBalance() {
    return this.http.get<ApiResponses<BalanceResponse>>(
      `${this.baseUrl}wallets/v1/me/`
    );
  }

  verifyPayments(reference: string) {
    return this.http.patch(
      `${this.baseUrl}payments/v1/verify/${reference}/`,
      {}
    );
  }

  getWalletTransactions(payload: any) {
    return this.http.get(`${this.baseUrl}wallets/v1/transactions/`);
  }
}
