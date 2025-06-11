import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { WritingService } from '../../shared/services/writing.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Correction, FeaturesResponse } from '../../models/api-responses';
import { DialogService } from '../../shared/services/dialog.service';
import { WritingModeComponent } from '../../shared/components/writing-mode/writing-mode.component';
import { QuillModule } from 'ngx-quill';
import { InsertWordAtIndexPipe } from '../../shared/pipes/insert-word-at-index.pipe';
import { DeleteWordAtIndexPipe } from '../../shared/pipes/delete-word-at-index.pipe';
import { ReplaceWordAtIndicesPipe } from '../../shared/pipes/replace-word-at-indices.pipe';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    QuillModule,
    ButtonComponent,
    InsertWordAtIndexPipe,
    DeleteWordAtIndexPipe,
    ReplaceWordAtIndicesPipe,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  private articleId = '';
  searchQuery: string = '';
  suggestions: Correction[] = [];
  errorMessage: string = '';
  featuresList = signal<FeaturesResponse[]>([]);
  selectedFeature = '';
  selectedCorrectionIndex = 0;
  correctedText: string = '';
  loadingSuggestions = signal(false);
  creatingArticle = signal(false);
  loadingArticle = signal(false);
  currentSuggestionList = signal('');

  private dialogService = inject(DialogService);
  private writingService = inject(WritingService);
  private route = inject(ActivatedRoute);
  // private insertFormat = inject(InsertWordAtIndexPipe);
  // private replaceFormat = inject(ReplaceWordAtIndicesPipe);
  // private deleteFormat = inject(DeleteWordAtIndexPipe);

  // Subject to emit search query changes.
  private searchQuerySubject: Subject<string> = new Subject<string>();

  private subscriptions: Subscription[] = [];
  private writingOption = computed(() => this.writingService.writingOptions());
  ai_refinement = false;
  refinedText: any = null;
  title = '';

  toolbarOptions = [
    ['bold', 'italic', 'underline'],
    // [{ header: [1, 2, false] }],
    [{ header: '' }, { header: 1 }, { header: 2 }],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ];

  constructor(
    private insertFormat: InsertWordAtIndexPipe,
    private replaceFormat: ReplaceWordAtIndicesPipe,
    private deleteFormat: DeleteWordAtIndexPipe
  ) {
    effect(() => {
      this.writingOption();
    });
  }

  ngOnInit(): void {
    this.getFeatures();
    this.checkMode();

    const sub = this.searchQuerySubject
      .pipe(
        debounceTime(1500), // Wait 1500ms after the last event.
        distinctUntilChanged(), // Only continue if the value has changed.
        switchMap((query: string): Observable<any> => {
          if (this.mode === 'create') {
            this.creatingArticle.set(true);
            return this.onCreateArticle();
          }

          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => {
          // this.results = data;
          this.creatingArticle.set(false);
          this.errorMessage = '';
          this.mode = 'edit';
          this.articleId = data.data.id || data.data.document_id;
        },
        error: (err) => {
          this.creatingArticle.set(false);
          this.errorMessage =
            'An error occurred while creating document. Please try again.';
        },
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.onUpdateArticle().subscribe();
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onEditorCreated(quill: any) {
    quill.legacyGetSemanticHTML = quill.getSemanticHTML;
    quill.getSemanticHTML = (a: number, b: number) =>
      quill
        .legacyGetSemanticHTML(a, b)
        .replaceAll(/((?:&nbsp;)*)&nbsp;/g, '$1 ');
  }

  onSetWritingMode() {
    this.dialogService.openDialog(WritingModeComponent, {
      width: '640px',
      data: {
        mode: 'edit',
      },
    });
  }

  onInputChange(query: any): void {
    if (!query) {
      return;
    }
    this.searchQuery = query.html;
    this.searchQuerySubject.next(query.html);
  }

  getFeatures() {
    this.writingService.getFeatures().subscribe({
      next: (res: any) => {
        this.featuresList.set(res.data.reverse());
        this.selectedFeature = res.data[0].feature;
      },
    });
  }

  checkMode() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.mode = 'edit';
        this.articleId = params.get('id') as string;
        this.getArticleById();

        return;
      }
      this.mode = 'create';
    });
  }

  getArticleById() {
    this.loadingArticle.set(true);
    const sub = this.writingService.getArticleById(this.articleId).subscribe({
      next: (res) => {
        this.loadingArticle.set(false);
        this.searchQuery = res.origin_document;
        this.title = res.title;
        this.writingService.setWritingOptions(res);
        this.onProcessDocument();
        // update the UI with the article body
      },
      error: () => {
        this.loadingArticle.set(false);
        // load error UI
      },
    });

    this.subscriptions.push(sub);
  }

  onProcessDocument() {
    this.ai_refinement = false;
    this.loadingSuggestions.set(true);
    this.writingService
      .processDocument({
        document_id: this.articleId,
        subscribed_feature: this.selectedFeature,
        origin_document: this.searchQuery,
      })
      .subscribe({
        next: (response: any) => {
          this.loadingSuggestions.set(false);
          this.currentSuggestionList.set(this.selectedFeature);
          this.correctedText = response.data.result.data.corrected_text;
          this.suggestions = response.data.result.data.corrections;
          this.selectedCorrectionIndex = 0;
          if (this.selectedFeature === 'AI_REFINEMENT') {
            this.ai_refinement = true;
            this.refinedText = {
              text: response.data.result.data.revamped_text,
              type: 'refinement',
            };
          }
        },
        error: () => {
          this.loadingSuggestions.set(false);
          this.correctedText = '';
          this.suggestions = [];
          this.selectedCorrectionIndex = 0;
        },
      });
  }

  onReposition() {
    this.loadingSuggestions.set(true);
    this.writingService
      .repositionWord({
        partially_corrected_word: this.searchQuery,
        fully_corrected_word: this.correctedText,
        corrections: this.suggestions,
      })
      .subscribe({
        next: (response: any) => {
          this.loadingSuggestions.set(false);
          this.suggestions = response.data;
          this.selectedCorrectionIndex = 0;
        },
        error: () => {
          this.loadingSuggestions.set(false);
          this.suggestions = [];
          this.selectedCorrectionIndex = 0;
        },
      });
  }

  onAcceptChange(correction: any) {
    // this.searchQuery = value;
    switch (correction.type) {
      case 'insertion':
        this.searchQuery = this.insertFormat.transform(
          this.searchQuery,
          correction.corrected_text,
          correction.position.start,
          false
        );
        this.onReposition();
        break;
      case 'replacement':
        this.searchQuery = this.replaceFormat.transform(
          this.searchQuery,
          correction.position.start,
          correction.position.end,
          correction.corrected_text,
          false
        );
        this.onReposition();
        break;
      case 'deletion':
        this.searchQuery = this.deleteFormat.transform(
          this.searchQuery,
          correction.position.start,
          correction.position.end,
          false
        );
        this.onReposition();
        break;
      case 'refinement':
        this.searchQuery = this.refinedText.text;
        this.refinedText = null;
        break;

      default:
        break;
    }
  }

  onCreateArticle() {
    const title = this.title || 'Untitled Document';
    return this.writingService.createArticle({
      origin_document: this.searchQuery,
      ...this.writingOption(),
      title: title,
    });
  }

  onUpdateArticle() {
    const title = this.title || 'Untitled Document';
    return this.writingService.updateArticle({
      ...this.writingOption(),
      document_id: this.articleId,
      origin_document: this.searchQuery,
      modified_document: this.searchQuery,
      subscribed_feature: this.selectedFeature,
      title: title,
      seed: 0,
    });
  }
}
