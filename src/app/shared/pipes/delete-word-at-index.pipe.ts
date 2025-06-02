import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'deleteWordAtIndex', standalone: true })
@Injectable({ providedIn: 'root' })
export class DeleteWordAtIndexPipe implements PipeTransform {
  transform(
    text: string,
    startIndex: number,
    endIndex: number,
    format = true
  ): string {
    // endIndex - 1 >= text.length ||
    if (startIndex < 0 || startIndex >= endIndex) {
      return text;
    }

    const deletedWord = text.slice(startIndex, endIndex);
    const before = text.slice(0, startIndex);
    const after = text.slice(endIndex);

    return format
      ? `${
          before.length > 10
            ? '...' + before.substring(before.length - 10)
            : before
        }<span class="line-through text-red-500">${deletedWord}</span>${
          after.length > 10 ? after.substring(0, 10) + '...' : after
        }`
      : `${before}${after}`.replace(/\s+/g, ' ').trim();
  }
}
