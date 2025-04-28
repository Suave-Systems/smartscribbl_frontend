import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponses,
  BillingHistoryResponse,
  PaginatedResponse,
} from '../../models/api-responses';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getSubscriptionList(payload: any) {
    return this.http.get<PaginatedResponse<BillingHistoryResponse>>(
      `${this.baseUrl}subscriptions/v1/`
    );
  }

  getSubscriptionById(id: string) {
    return this.http.get(`${this.baseUrl}subscriptions/v1/${id}/`);
  }

  cancelSubscription(id: number) {
    return this.http.patch(`${this.baseUrl}subscriptions/v1/${id}/cancel/`, {});
  }

  getCurrentPlan() {
    return this.http.get<ApiResponses<BillingHistoryResponse>>(
      `${this.baseUrl}subscriptions/v1/current-plan/`
    );
  }

  getPlanList() {
    return this.http.get(`${this.baseUrl}subscriptions/v1/plan/`);
  }

  getPlanById(id: string) {
    return this.http.get(`${this.baseUrl}subscriptions/v1/plan/${id}/`);
  }
}
