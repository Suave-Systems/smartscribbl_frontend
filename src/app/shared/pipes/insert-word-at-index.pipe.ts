import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'insertWordAtIndex', standalone: true })
@Injectable({ providedIn: 'root' })
export class InsertWordAtIndexPipe implements PipeTransform {
  transform(text: string, word: string, index: number, format = true): string {
    // || index > text.length
    if (index < 0) return text;

    let before = text.slice(0, index).trimEnd();
    let after = text.slice(index).trimStart();

    return format
      ? `${
          (before.length || 0) > 10
            ? '...' + before.substring(before.length - 10)
            : before
        } <span class="font-bold text-primary">${word}</span> ${
          (after.length || 0) > 10 ? after.substring(0, 10) + '...' : after
        }`
          .replace(/\s+/g, ' ')
          .trim()
      : `${before} ${word} ${after}`.replace(/\s+/g, ' ').trim();
  }
}
