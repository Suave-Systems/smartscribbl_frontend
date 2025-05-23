import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { WritingService } from '../../shared/services/writing.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DialogService } from '../../shared/services/dialog.service';
import { WritingModeComponent } from '../../shared/components/writing-mode/writing-mode.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonComponent,
    PageTitleComponent,
    RouterLink,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoading = signal(false);

  private writingService = inject(WritingService);
  private dialogService = inject(DialogService);
  articleList = signal<any[]>([]);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getArticles();
  }

  onCreateArticle() {
    this.dialogService.openDialog(WritingModeComponent, {
      width: '640px',
    });
  }

  getArticles() {
    this.isLoading.set(true);
    const sub = this.writingService.getArticleList().subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.articleList.set(res.results);
      },
      error: () => {
        this.isLoading.set(false);
        this.articleList.set([]);
      },
    });

    this.subscriptions.push(sub);
  }
}
