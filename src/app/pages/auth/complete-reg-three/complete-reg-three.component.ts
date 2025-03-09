import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-complete-reg-three',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './complete-reg-three.component.html',
  styleUrl: './complete-reg-three.component.scss',
})
export class CompleteRegThreeComponent {
  options: any[] = [
    'Improve correcteness and clarity of my writing',
    'Create or enforce a writing style guide',
    'Create and enforce a brand voice or tone',
    'Reuse commonly used text and templates',
    'Sound Fluent in English',
    'Improve the quality of my writing',
  ];

  // options: any[] = [];
  selectedOptions: any[] = [];

  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  errorMessage = '';

  ngOnInit() {
    // this.getOptions();
  }

  getOptions() {
    this.authService.getWritingIntentions().subscribe((res: any) => {
      this.options = res;
    });
  }

  getUserMetaData() {
    this.authService.getUserMetaDataById('').subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          // patch form Value
        }
      },
    });
  }
  onSave() {
    this.authService.updateUserMetaDataById('').subscribe({
      next: () => {
        this.notification.success(
          `You're almost set! 🎉 Let's make your writing clear and impactful. Ready to dive in?`,
          'SUCCESS'
        );
        this.router.navigate(['/main/dashboard']);
      },
    });
  }
}
