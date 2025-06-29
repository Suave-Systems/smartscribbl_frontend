import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceWordAtIndices', standalone: true })
@Injectable({ providedIn: 'root' })
export class ReplaceWordAtIndicesPipe implements PipeTransform {
  transform(
    text: string,
    startIndex: number,
    endIndex: number,
    newWord: string,
    format = true
  ): string {
    // || endIndex - 1 >= text.length
    if (startIndex < 0 || startIndex > endIndex) {
      return text;
    }

    const oldWord = text.slice(startIndex, endIndex);
    const before = text.slice(0, startIndex);
    const after = text.slice(endIndex);

    return format
      ? `${
          (before.length || 0) > 10
            ? '...' + before.substring(before.length - 10)
            : before
        }<span class="line-through text-red-500">${oldWord}</span> <span class="font-bold text-primary">${newWord}</span>${
          (after.length || 0) > 10 ? after.substring(0, 10) + '...' : after
        }`
      : `${before}${newWord}${after}`;
    // return `${before}${newWord}${after}`;
  }
}
