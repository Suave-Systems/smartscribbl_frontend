import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiResponses,
  Correction,
  CreateDocumentRequest,
  CreateDocumentResponse as DocumentResponse,
  FeaturesResponse,
  PaginatedResponse,
  PreferredWritingOption,
  ProcessDocumentRequest,
  ProcessDocumentResponse,
  RepositionWordRequest,
  WritingOption,
} from '../../models/api-responses';

@Injectable({
  providedIn: 'root',
})
export class WritingService {
  private baseApi = environment.baseUrl;
  private http = inject(HttpClient);
  private _writingOptions = signal<PreferredWritingOption | null>(null);

  setWritingOptions(options: PreferredWritingOption) {
    this._writingOptions.set(options);
  }

  get writingOptions() {
    return this._writingOptions.asReadonly();
  }

  createArticle(payload: CreateDocumentRequest) {
    return this.http.post<ApiResponses<DocumentResponse>>(
      `${this.baseApi}services/v1/articles/`,
      payload
    );
  }

  getArticleList(params: Record<string, string> = {}) {
    const keys = Object.keys(params);
    let url = `${this.baseApi}services/v1/articles/`;
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
    return this.http.get<PaginatedResponse<DocumentResponse>>(`${url}`);
  }

  getArticleById(id: string) {
    return this.http.get<DocumentResponse>(
      `${this.baseApi}services/v1/articles/${id}/`
    );
  }

  deleteArticle(id: any) {
    return this.http.delete<DocumentResponse>(
      `${this.baseApi}services/v1/articles/${id}/`
    );
  }

  updateArticle(payload: any) {
    return this.http.post(
      `${this.baseApi}services/v1/articles/update_article/`,
      payload
    );
  }

  processDocument(payload: ProcessDocumentRequest) {
    return this.http.post<ApiResponses<ProcessDocumentResponse>>(
      `${this.baseApi}services/v1/article/process_document/`,
      payload
    );
  }

  repositionWord(payload: RepositionWordRequest) {
    return this.http.post<ApiResponses<Correction[]>>(
      `${this.baseApi}services/v1/article/word_repositioning/`,
      payload
    );
  }

  getFeatures() {
    return this.http.get<ApiResponses<FeaturesResponse>>(
      `${this.baseApi}services/v1/features/?mode=SUBSCRIPTION`
    );
  }

  getWritingOptions() {
    return this.http.get<ApiResponses<WritingOption>>(
      `${this.baseApi}services/v1/article/options/`
    );
  }
}
