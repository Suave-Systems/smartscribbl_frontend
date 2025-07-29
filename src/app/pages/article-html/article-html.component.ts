import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { Correction, FeaturesResponse } from '../../models/api-responses';
import { FormsModule } from '@angular/forms';
import { NgClass, TitleCasePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InsertWordAtIndexPipe } from '../../shared/pipes/insert-word-at-index.pipe';
import { DeleteWordAtIndexPipe } from '../../shared/pipes/delete-word-at-index.pipe';
import { ReplaceWordAtIndicesPipe } from '../../shared/pipes/replace-word-at-indices.pipe';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
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
import './blue-underline'; // adjust the path as needed
import Quill from 'quill';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RefinementDialogComponent } from '../../shared/components/refinement-dialog/refinement-dialog.component';

const AlignStyle: any = Quill.import('attributors/style/align');
AlignStyle.whitelist = ['right', 'center', 'justify', 'left'];
Quill.register(AlignStyle, true);

export enum FeatureType {
  SpellingChecker = 'SPELLING_CHECKER',
  SentenceRephrase = 'SENTENCE_REPHRASE',
  AiRefinement = 'AI_REFINEMENT',
}

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
    TitleCasePipe,
    RouterLink,
    MatTooltipModule,
  ],
  templateUrl: './article-html.component.html',
  styleUrl: './article-html.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleHtmlComponent implements OnInit {
  @ViewChildren('suggestionRef') suggestionRefs!: QueryList<ElementRef>;

  mode: 'create' | 'edit' = 'create';
  articleId = '';
  searchQuery: string = '';
  quillEditorInstance: any;
  deltaContent: any = null;

  suggestions: Correction[] = [];
  errorMessage: string = '';
  featuresList = signal<FeaturesResponse[]>([]);
  selectedFeature = '';
  FeatureType = FeatureType;
  selectedCorrectionIndex = -1;
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
  refinedText: any = null;
  title = '';

  toolbarOptions = [
    ['bold', 'italic', 'underline'],
    [{ header: '' }, { header: 1 }, { header: 2 }, { header: 3 }],
    [{ align: [] }],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ];

  constructor(private cookieService: CookiesService) {
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

    // this.quillEditorInstance.formatLine(
    //   0,
    //   this.searchQuery.length,
    //   {
    //     align: 'justify',
    //   },
    //   'user'
    // );
  }

  ngOnDestroy() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.onUpdateArticle().subscribe();
    this.subscriptions.length > 0 &&
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onEditorCreated(quill: any) {
    this.quillEditorInstance = quill;

    quill.root.addEventListener('click', (e: MouseEvent) => {
      const selection = quill.getSelection();
      if (selection) {
        this.onEditorClick(selection.index);
      }
    });

    // Remove redUnderline format when pasting
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
      delta.ops.forEach((op: any) => {
        if (op.attributes && op.attributes.redUnderline) {
          delete op.attributes.redUnderline;
        }
        if (op.attributes && op.attributes.blueUnderline) {
          delete op.attributes.blueUnderline;
        }
      });
      return delta;
    });
  }

  onEditorClick(clickedIndex: number) {
    // Find the suggestion whose range includes the clicked index
    const foundIndex = this.suggestions.findIndex((correction: any) => {
      const { start, end } = correction.position;
      return clickedIndex >= start && clickedIndex <= end;
    });

    if (foundIndex !== -1) {
      this.scrollSuggestionIntoView(foundIndex);
    }
  }

  scrollSuggestionIntoView(index: number) {
    const element = this.suggestionRefs.find((_, i) => i === index);
    if (element) {
      element.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      this.onSelectCorrection(this.suggestions[index], index);
    }
  }

  onDeltaChange(event: any) {
    this.deltaContent = event.editor.getContents();
    this.searchQuery = event.editor.getText(); // This gives raw text for index-based processing;
    this.searchQuerySubject.next(this.searchQuery);
    this.resetInactivityTimer();
  }

  onSelectCorrection(result: any, index: number) {
    if (this.selectedCorrectionIndex === index) return;
    this.selectedCorrectionIndex = index;
    const { start, end } = result.position;
    const length = end - start;

    if (!this.quillEditorInstance) return;

    // 1. Move the cursor to the word
    this.quillEditorInstance.setSelection(end, 0, 'user');

    this.quillEditorInstance.formatText(
      0,
      this.quillEditorInstance.getLength(),
      {
        background: false,
      },
      'user'
    );

    // 2. Add background color based on correction type
    const bgColor =
      this.selectedFeature === FeatureType.SentenceRephrase
        ? '#0D79C933'
        : '#fb2c3633';

    this.quillEditorInstance.formatText(
      start,
      length,
      {
        background: bgColor,
      },
      'user'
    );

    const bounds = this.quillEditorInstance.getBounds(start);
    const container = this.quillEditorInstance.root.parentElement;
    container?.scrollTo({ top: bounds.top - 50, behavior: 'smooth' });
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

  private getFeatures() {
    this.writingService.getFeatures().subscribe({
      next: (res: any) => {
        this.featuresList.set(res.data);
        this.selectedFeature = res.data[0].feature;
      },
    });
  }

  private checkMode() {
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

  private handleNoSubscription() {
    this.notify.error(
      'You need an active subscription to use this feature. Please subscribe to continue.',
      'Subscription Required'
    );
  }

  private highlightError(startIndex: number, endIndex: number) {
    if (!this.quillEditorInstance) return;

    const length = endIndex - startIndex;

    if (this.selectedFeature === FeatureType.SentenceRephrase) {
      this.quillEditorInstance.formatText(
        startIndex,
        length,
        'blueUnderline',
        true,
        'user'
      );
      return;
    }
    this.quillEditorInstance.formatText(
      startIndex,
      length,
      'redUnderline',
      true,
      'user'
    );
  }

  private loopAndHighlightErrors() {
    this.quillEditorInstance.formatText(
      0,
      this.quillEditorInstance.getLength(),
      {
        background: false,
        underline: false,
        redUnderline: false,
        blueUnderline: false,
      },
      'user'
    );
    if (this.suggestions && this.suggestions.length > 0) {
      this.suggestions.forEach((correction) => {
        const { start, end } = correction.position;
        this.highlightError(start, end);
      });
    }
  }

  onProcessDocument() {
    if (!this.activeSubscription()) {
      this.handleNoSubscription();
      return;
    }
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
          this.loopAndHighlightErrors();

          // populate the text area with the corrected text[response.data.result.original_text];
          this.onSelectCorrection(this.suggestions[0], 0);
          if (this.selectedFeature === FeatureType.AiRefinement) {
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
        },
      });
  }

  private onReposition() {
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
          this.onSelectCorrection(this.suggestions[0], 0);
        },
        error: () => {
          this.loadingSuggestions.set(false);
          this.suggestions = [];
        },
      });
  }

  onAcceptChange(correction: any, index: number) {
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

    if (index !== -1) {
      this.suggestions.splice(index, 1);
      this.onReposition();
    }
  }

  onDismissChange(suggestion: any, index: number) {
    if (this.refinedText) {
      this.refinedText = null;
      return;
    }
    const { start, end } = suggestion.position;

    this.quillEditorInstance.deleteText(start, end - start, 'user');
    this.quillEditorInstance.insertText(
      start,
      suggestion.original_text,
      'user'
    );
    if (index !== -1) {
      this.suggestions.splice(index, 1);
    }
    this.loopAndHighlightErrors();
    index > 0
      ? this.onSelectCorrection(this.suggestions[index - 1], index - 1)
      : null;
  }

  private getArticleById() {
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
      },
    });

    this.subscriptions.push(sub);
  }

  private onCreateArticle() {
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

  private onUpdateArticle(): Observable<any> {
    if (!this.activeSubscription()) {
      this.handleNoSubscription();
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

  onReadMore() {
    this.dialogService
      .openDialog(RefinementDialogComponent, {
        width: '640px',
        data: { refinedText: this.refinedText },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.accept) {
          this.onAcceptChange(this.refinedText, 0);
          return;
        }
        this.onDismissChange(this.refinedText, 0);
      });
  }
}
