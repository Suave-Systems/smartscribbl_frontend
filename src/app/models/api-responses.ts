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

export interface CreateDocumentResponse {
  origin_document: string;
  id: number;
  modified_document?: any;
  user: number;
  date_created: string;
  versions: any[];
  latest_version?: any;
}
export interface ProcessDocumentResponse {
  origin_document: OriginDocument;
  result: Result;
  seed: number;
}

export interface Result {
  original_text: string;
  corrected_text: string;
  corrections: Correction[];
}

export interface Correction {
  original_text: string;
  corrected_text: string;
  position: Position;
  type: string;
}

export interface Position {
  start: number;
  end: number;
}

export interface OriginDocument {
  id: number;
  text: string;
}

export interface FeaturesResponse {
  name: string;
  description: string;
  is_free: boolean;
  amount_per_request: number;
  mode: string;
  feature: string;
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

export interface RepositionWordRequest {
  partially_corrected_word: string;
  fully_corrected_word: string;
}

export interface CreateDocumentRequest {
  origin_document: string;
  audient_type?: string;
  tone_type?: string;
  context_type?: string;
  goal_type?: string;
  english_type?: string;
  title?: string;
}

export interface PreferredWritingOption {
  audient_type?: string;
  tone_type?: string;
  context_type?: string;
  goal_type?: string;
  english_type?: string;
}

export interface ProcessDocumentRequest {
  document_id: string;
  subscribed_feature: string;
  origin_document: string;
}

export interface WritingOption {
  audience_types: Datum[];
  tone_types: Datum[];
  context_types: Datum[];
  goal_types: Datum[];
  english_types: Datum[];
}

export interface Datum {
  key: string;
  label: string;
  is_default: boolean;
}
