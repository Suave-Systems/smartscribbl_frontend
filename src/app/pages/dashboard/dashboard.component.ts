import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { WritingService } from '../../shared/services/writing.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DialogService } from '../../shared/services/dialog.service';
import { WritingModeComponent } from '../../shared/components/writing-mode/writing-mode.component';
import { DatePipe } from '@angular/common';
import {
  DeleteDialogComponent,
  DeleteDialogData,
} from '../../shared/components/delete-dialog/delete-dialog.component';
import { CookiesService } from '../../shared/services/cookies.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonComponent,
    PageTitleComponent,
    RouterLink,
    EmptyStateComponent,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoading = signal(false);

  private writingService = inject(WritingService);
  private dialogService = inject(DialogService);
  private cookieService = inject(CookiesService);
  private router = inject(Router);
  articleList = signal<any[]>([]);
  private activeSubscription = signal<boolean>(false);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getArticles();
    this.activeSubscription.set(
      JSON.parse(this.cookieService.get('subscription')) as boolean
    );
  }

  onCreateArticle() {
    if (this.activeSubscription()) {
      this.dialogService.openDialog(WritingModeComponent, {
        width: '640px',
        data: { mode: 'new' },
      });
    } else {
      this.dialogService
        .openDialog(ConfirmDialogComponent, {
          data: {
            title: 'Subscription Required',
            message:
              'You need an active subscription to create a new article. Please subscribe to continue.',
            confirmText: 'Subscribe Now',
            cancelText: 'Cancel',
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['/main/subscription'], {
              queryParams: { planList: true },
            });
          }
        });
    }
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

  onDeleteArticle(article: any) {
    const data: DeleteDialogData = {
      title: 'Delete Article',
      message: 'Are you sure you want to delete this article permanently?',
      confirmText: 'Delete',
      cancelText: 'Keep',
    };

    this.dialogService
      .openDialog(DeleteDialogComponent, {
        data,
        panelClass: 'no-padding-dialog',
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.writingService.deleteArticle(article.id).subscribe({
          next: () => {
            this.getArticles();
          },
        });
      });
  }
}
