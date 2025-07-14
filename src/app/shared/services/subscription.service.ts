import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponses,
  BillingHistoryResponse,
  PaginatedResponse,
  Plan,
} from '../../models/api-responses';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getSubscriptionList(params: Record<string, string> = {}) {
    let url = `${this.baseUrl}subscriptions/v1/`;
    const keys = Object.keys(params);
    if (keys.length > 0) {
      const queryString = keys
        .filter(
          (key) =>
            params[key] !== undefined &&
            params[key] !== null &&
            params[key] !== ''
        )
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&');

      url += url.includes('?') ? '&' + queryString : '?' + queryString;
    }
    return this.http.get<PaginatedResponse<BillingHistoryResponse>>(`${url}`);
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
    return this.http.get<Plan[]>(`${this.baseUrl}subscriptions/v1/plan/`);
  }

  getPlanById(id: string) {
    return this.http.get(`${this.baseUrl}subscriptions/v1/plan/${id}/`);
  }
}
