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
import { SmartEditorComponent } from '../../shared/components/smart-editor/smart-editor.component';
import { DialogService } from '../../shared/services/dialog.service';
import { WritingModeComponent } from '../../shared/components/writing-mode/writing-mode.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [FormsModule, NgClass, ButtonComponent, SmartEditorComponent],
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

  private dialogService = inject(DialogService);
  private writingService = inject(WritingService);
  private route = inject(ActivatedRoute);

  // Subject to emit search query changes.
  private searchQuerySubject: Subject<string> = new Subject<string>();

  private subscriptions: Subscription[] = [];
  private writingOption = computed(() => this.writingService.writingOptions());
  ai_refinement = false;
  refinedText: any = {};
  title = '';

  constructor() {
    effect(() => {
      this.writingOption();
    });
  }

  ngOnInit(): void {
    this.getFeatures();
    this.checkMode();
    // this.onSetWritingMode();

    const sub = this.searchQuerySubject
      .pipe(
        debounceTime(500), // Wait 500ms after the last event.
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

  onSetWritingMode() {
    this.dialogService.openDialog(WritingModeComponent, {
      width: '640px',
      data: {
        mode: 'edit',
      },
    });
  }

  onInputChange(query: string): void {
    this.searchQuerySubject.next(query);
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
        this.searchQuery = this.insertWordAtIndex(
          this.searchQuery,
          correction.corrected_text,
          correction.position.start,
          false
        );
        break;
      case 'replacement':
        this.searchQuery = this.replaceSubstringByIndices(
          this.searchQuery,
          correction.position.start,
          correction.position.end,
          correction.corrected_text,
          false
        );
        break;
      case 'refinement':
        this.searchQuery = this.refinedText.text;
        break;

      default:
        break;
    }

    this.onReposition();
  }

  onSave() {
    if (this.mode === 'create') {
      return this.onCreateArticle();
    }

    return this.onUpdateArticle();
  }

  onCreateArticle() {
    this.title = this.searchQuery.trim().split('\n')[0].slice(0, 25);
    return this.writingService.createArticle({
      origin_document: this.searchQuery,
      ...this.writingOption(),
      title: this.title,
    });
  }

  onUpdateArticle() {
    return this.writingService.updateArticle({
      document_id: this.articleId,
      origin_document: this.searchQuery,
      modified_document: this.searchQuery,
      subscribed_feature: this.selectedFeature,
      title: this.title,
      ...this.writingOption(),
      seed: 0,
    });
  }

  // insertWordAtIndex(text: string, word: string, index: number): string {
  //   const words = text.split(' ');
  //   if (index < 0 || index > words.length) return text;
  //   words.splice(index, 0, word);
  //   return words.join(' ');
  // }

  insertWordAtIndex(
    text: string,
    word: string,
    index: number,
    format = true
  ): string {
    if (index < 0 || index > text.length) return text;

    let before = text.slice(0, index).trimEnd();
    let after = text.slice(index).trimStart();

    return format
      ? `${
          (before.length || 0) > 10
            ? '...' + before.substring(before.length - 10, before.length)
            : before
        } <span class="font-bold text-primary">${word}</span> ${
          (after.length || 0) > 10 ? after.substring(0, 10) + '...' : after
        }`
          .replace(/\s+/g, ' ')
          .trim()
      : `${before} ${word} ${after}`.replace(/\s+/g, ' ').trim();
  }

  replaceSubstringByIndices(
    text: string,
    startIndex: number,
    endIndex: number,
    newWord: string,
    format = true
  ): string {
    if (
      startIndex < 0 ||
      endIndex - 1 >= text.length ||
      startIndex > endIndex
    ) {
      return text;
    }
    const oldWord = text.slice(startIndex, endIndex);
    const before = text.slice(0, startIndex);
    const after = text.slice(endIndex);
    // return text.slice(0, startIndex) + newWord + text.slice(endIndex + 1);
    return format
      ? `${
          (before.length || 0) > 10
            ? '...' + before.substring(before.length - 10, before.length)
            : before
        }<span class="line-through text-red-500">${oldWord}</span> <span class="font-bold text-primary">${newWord}</span>${
          (after.length || 0) > 10 ? after.substring(0, 10) + '...' : after
        }`
      : `${before}${newWord}${after}`;
  }

  // getUnderlinedErrors(): string {
  //   let formattedText = this.originalText;
  //   this.corrections.forEach((correction) => {
  //     const regex = new RegExp(`\\b${correction.original_text}\\b`, 'g');
  //     formattedText = formattedText.replace(
  //       regex,
  //       `<span class="underline-error">${correction.original_text}</span>`
  //     );
  //   });
  //   return formattedText;
  // }

  // getHighlightedCorrections(): string {
  //   let formattedText = this.originalText;
  //   this.corrections.forEach((correction) => {
  //     const regex = new RegExp(`\\b${correction.original_text}\\b`, 'g');
  //     formattedText = formattedText.replace(
  //       regex,
  //       `<span class="highlight-correction">${correction.corrected_text}</span>`
  //     );
  //   });
  //   return formattedText;
  // }

  // getFormattedText(): string {
  //   let words = this.originalText.split(' ');

  //   this.corrections.forEach((correction) => {
  //     if (correction.type === 'insertion') {
  //       words.splice(
  //         correction.position.start, // Insert at the right index
  //         0,
  //         `<span class="inserted-word">${correction.corrected_text}</span>`
  //       );
  //     } else if (correction.type === 'deletion') {
  //       words = words.map((word) =>
  //         word === correction.original_text
  //           ? `<span class="deleted-word">${word}</span>`
  //           : word
  //       );
  //     } else if (correction.type === 'replacement') {
  //       words = words.map((word) =>
  //         word === correction.original_text
  //           ? `<span class="highlight-correction">${correction.corrected_text}</span>`
  //           : word
  //       );
  //     }
  //   });

  //   return words.join(' ');
  // }
}
