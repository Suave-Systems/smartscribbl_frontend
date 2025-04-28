export interface PaginatedResponse<T> {
  count: number;
  next?: any;
  previous?: any;
  results: T[];
}

export interface TransactionHistoryResponse {
  id: number;
  archived?: any;
  last_modified: string;
  date_created: string;
  amount: string;
  reference: string;
  status: string;
  payment_type: string;
  payment_channel?: any;
  gateway_charge: string;
  service_charge: string;
  number_of_months?: any;
  user: number;
  plan?: any;
}

export interface BillingHistoryResponse {
  id: number;
  plan_name: string;
  is_active: boolean;
  archived?: any;
  last_modified: string;
  date_created: string;
  status: string;
  number_of_months: number;
  next_billing_date: string;
  user: number;
  plan: number;
}

export interface ApiResponses<T> {
  code: number;
  data: T;
}

export interface BalanceResponse {
  id: number;
  balance: string;
  user: number;
}
