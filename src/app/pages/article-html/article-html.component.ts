import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Correction, FeaturesResponse } from '../../models/api-responses';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InsertWordAtIndexPipe } from '../../shared/pipes/insert-word-at-index.pipe';
import { DeleteWordAtIndexPipe } from '../../shared/pipes/delete-word-at-index.pipe';
import { ReplaceWordAtIndicesPipe } from '../../shared/pipes/replace-word-at-indices.pipe';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';
import { WritingService } from '../../shared/services/writing.service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { CookiesService } from '../../shared/services/cookies.service';
import { WritingModeComponent } from '../../shared/components/writing-mode/writing-mode.component';
import './red-underline'; // adjust the path as needed

@Component({
  selector: 'app-article-html-test',
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
  templateUrl: './article-html.component.html',
  styleUrl: './article-html.component.scss',
})
export class ArticleHtmlComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  private articleId = '';
  searchQuery: string = '';
  quillEditorInstance: any;
  deltaContent: any = null;
  // plainTextContent: string = '';

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
  private activeSubscription = signal<boolean>(false);

  private dialogService = inject(DialogService);
  private writingService = inject(WritingService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);

  // Subject to emit search query changes.
  private searchQuerySubject: Subject<string> = new Subject<string>();
  private subscriptions: Subscription[] = [];
  private inactivityTimer: any;
  private writingOption = computed(() => this.writingService.writingOptions());
  ai_refinement = false;
  refinedText: any = null;
  title = '';

  toolbarOptions = [
    ['bold', 'italic', 'underline'],
    [{ header: '' }, { header: 1 }, { header: 2 }, { header: 3 }],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ];

  constructor(
    private insertFormat: InsertWordAtIndexPipe,
    private replaceFormat: ReplaceWordAtIndicesPipe,
    private deleteFormat: DeleteWordAtIndexPipe,
    private cookieService: CookiesService
  ) {
    this.activeSubscription.set(
      JSON.parse(this.cookieService.get('subscription')) as boolean
    );
    effect(() => {
      this.writingOption();
    });
  }

  ngOnInit(): void {
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
          if (!this.articleId) this.articleId = data?.data?.id;
        },
        error: (err) => {
          this.creatingArticle.set(false);
          this.errorMessage =
            'An error occurred while creating document. Please try again.';
        },
      });

    this.subscriptions.push(sub);
    this.getFeatures();
    this.checkMode();
  }

  ngOnDestroy() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.onUpdateArticle().subscribe();
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // onEditorCreated(quill: any) {
  //   quill.legacyGetSemanticHTML = quill.getSemanticHTML;
  //   quill.getSemanticHTML = (a: number, b: number) =>
  //     quill
  //       .legacyGetSemanticHTML(a, b)
  //       .replaceAll(/((?:&nbsp;)*)&nbsp;/g, '$1 ');
  // }

  onEditorCreated(quill: any) {
    this.quillEditorInstance = quill;
  }

  onDeltaChange(event: any) {
    this.deltaContent = event.editor.getContents();
    this.searchQuery = event.editor.getText(); // This gives raw text for index-based processing;
    this.searchQuerySubject.next(this.searchQuery);
    // this.plainTextContent = event.editor.getText(); // This gives raw text for index-based processing
    this.resetInactivityTimer();
  }

  onSelectCorrection(result: any) {
    const index = result.position.start;
    this.quillEditorInstance.setSelection(index, 0, 'user');
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      if (this.articleId) {
        this.onUpdateArticle().subscribe();
      }
    }, 10000); // 10 seconds
  }

  onSetWritingMode() {
    this.dialogService.openDialog(WritingModeComponent, {
      width: '640px',
      data: {
        mode: 'edit',
      },
    });
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
    // if (!this.quillEditorInstance) return;
    this.loadingArticle.set(true);
    const sub = this.writingService.getArticleById(this.articleId).subscribe({
      next: (res) => {
        this.loadingArticle.set(false);
        this.title = res.title;
        this.writingService.setWritingOptions(res);
        this.quillEditorInstance?.setText(res.origin_document);
        // this.onProcessDocument();
      },
      error: () => {
        this.loadingArticle.set(false);
        // load error UI
      },
    });

    this.subscriptions.push(sub);
  }

  handleNoSubscription() {
    this.notify.error(
      'You need an active subscription to use this feature. Please subscribe to continue.',
      'Subscription Required'
    );
  }

  highlightError(startIndex: number, endIndex: number) {
    if (!this.quillEditorInstance) return;

    const length = endIndex - startIndex;

    this.quillEditorInstance.formatText(
      startIndex,
      length,
      'redUnderline',
      true,
      'user'
    );
  }

  loopAndHighlightErrors() {
    if (this.suggestions && this.suggestions.length > 0) {
      this.suggestions.forEach((correction) => {
        const { start, end } = correction.position;
        this.highlightError(start, end);
      });
    }
  }

  onProcessDocument() {
    // this.highlightError(0, 5);
    if (!this.activeSubscription()) {
      this.handleNoSubscription();
      return;
    }
    this.ai_refinement = false;
    this.loadingSuggestions.set(true);
    this.writingService
      .processDocument({
        editor_type: 'TEXT',
        document_id: this.articleId,
        subscribed_feature: this.selectedFeature,
        origin_document: this.searchQuery,
      })
      .subscribe({
        next: (response: any) => {
          this.loadingSuggestions.set(false);
          this.currentSuggestionList.set(this.selectedFeature);
          this.correctedText = response.data.result.data.corrected_text;
          this.suggestions = response.data.result.data.corrections || [];
          // this.searchQuery = response.data.result.data.original_text;
          this.loopAndHighlightErrors();

          // populate the text area with the corrected text[response.data.result.original_text];
          this.selectedCorrectionIndex = 0;
          if (this.selectedFeature === 'AI_REFINEMENT') {
            this.ai_refinement = true;
            this.refinedText = {
              text: response.data.result.data.corrected_text,
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
    if (!this.activeSubscription()) {
      this.handleNoSubscription();
      return;
    }
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
          this.suggestions = response.data.corrections;
          this.loopAndHighlightErrors();
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
    const { start, end } = correction.position || { start: 0, end: 0 };

    if (!this.quillEditorInstance) return;

    switch (correction.type) {
      case 'insertion':
        this.quillEditorInstance.insertText(
          start,
          correction.corrected_text,
          'user'
        );
        break;

      case 'replacement':
        this.quillEditorInstance.deleteText(start, end - start, 'user');
        this.quillEditorInstance.insertText(
          start,
          correction.corrected_text,
          'user'
        );
        break;

      case 'deletion':
        this.quillEditorInstance.deleteText(start, end - start, 'user');
        break;

      case 'refinement':
        if (this.refinedText?.text) {
          this.quillEditorInstance.setText(this.refinedText.text);
          this.refinedText = null;
        }
        break;
    }

    this.onReposition();
  }

  onDismissChange(suggestion: any, index: number) {
    const { start, end } = suggestion.position;
    const length = end - start;

    this.quillEditorInstance.formatText(
      start,
      length,
      {
        underline: false,
        color: 'black',
      },
      'user'
    );
    if (index !== -1) {
      this.suggestions.splice(index, 1);
    }
    this.loopAndHighlightErrors();
    this.selectedCorrectionIndex = 0;
  }

  onCreateArticle() {
    if (!this.activeSubscription()) {
      this.handleNoSubscription();
      return of(null);
    }
    const title = this.title || 'Untitled Document';
    return this.writingService.createArticle({
      origin_document: this.searchQuery,
      ...this.writingOption(),
      title: title,
    });
  }

  onUpdateArticle(): Observable<any> {
    if (!this.activeSubscription()) {
      // this.handleNoSubscription();
      return of(null);
    }
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
