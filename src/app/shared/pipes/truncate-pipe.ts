import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 2): string {
    if (!value) return '';

    const words = value.trim().split(/\s+/);

    if (words.length <= limit) return value;

    return words.slice(0, limit).join(' ') + '...';
  }
}
