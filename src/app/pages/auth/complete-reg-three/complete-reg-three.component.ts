import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';

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
}
