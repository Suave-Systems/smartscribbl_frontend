import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface Correction {
  original_text: string;
  corrected_text: string;
  position: { start: number; end: number };
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  originalText: string = 'She went to the market.';
  correctedText: string = 'She quickly went to the market.';

  corrections: Correction[] = [
    {
      original_text: '',
      corrected_text: 'quickly',
      position: { start: 4, end: 4 },
      type: 'insertion',
    },
  ];

  textToDisplay = '';

  ngOnInit() {
    this.textToDisplay = this.getUnderlinedErrors();
  }

  getUnderlinedErrors(): string {
    let formattedText = this.originalText;
    this.corrections.forEach((correction) => {
      const regex = new RegExp(`\\b${correction.original_text}\\b`, 'g');
      formattedText = formattedText.replace(
        regex,
        `<span class="underline-error">${correction.original_text}</span>`
      );
    });
    return formattedText;
  }

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

  getFormattedText(): string {
    let words = this.originalText.split(' ');

    this.corrections.forEach((correction) => {
      if (correction.type === 'insertion') {
        words.splice(
          correction.position.start, // Insert at the right index
          0,
          `<span class="inserted-word">${correction.corrected_text}</span>`
        );
      } else if (correction.type === 'deletion') {
        words = words.map((word) =>
          word === correction.original_text
            ? `<span class="deleted-word">${word}</span>`
            : word
        );
      } else if (correction.type === 'replacement') {
        words = words.map((word) =>
          word === correction.original_text
            ? `<span class="highlight-correction">${correction.corrected_text}</span>`
            : word
        );
      }
    });

    return words.join(' ');
  }
}
