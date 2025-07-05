import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'replaceWordAtIndices', standalone: true })
@Injectable({ providedIn: 'root' })
export class ReplaceWordAtIndicesPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    text: string,
    startIndex: number,
    endIndex: number,
    newWord: string,
    format = true
  ): any {
    // || endIndex - 1 >= text.length
    if (startIndex < 0 || startIndex > endIndex) {
      return text;
    }

    const oldWord = text.slice(startIndex, endIndex);
    const before = text.slice(0, startIndex);
    const after = text.slice(endIndex);

    if (format) {
      // const formattedString = `${before}${newWord}${after}`;
      const formattedString = `${
        (before.length || 0) > 10
          ? '...' + before.substring(before.length - 10)
          : before
      }<span class="line-through text-red-500">${oldWord}</span> <span class="font-bold text-primary">${newWord}</span>${
        (after.length || 0) > 10 ? after.substring(0, 10) + '...' : after
      }`;

      return this.sanitizer.bypassSecurityTrustHtml(formattedString);
    }

    return `${before}${newWord}${after}`;
  }
}
