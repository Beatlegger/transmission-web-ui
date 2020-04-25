import { Pipe, PipeTransform } from '@angular/core';

export type ByteUnit = 'B' | 'kB' | 'KB' | 'MB' | 'GB' | 'TB';

@Pipe({
  name: 'byte'
})
export class BytePipe implements PipeTransform {
  static formats: { [key: string]: { max: number; prev?: ByteUnit } } = {
    B: { max: 1024 },
    kB: { max: Math.pow(1024, 2), prev: 'B' },
    KB: { max: Math.pow(1024, 2), prev: 'B' }, // Backward compatible
    MB: { max: Math.pow(1024, 3), prev: 'kB' },
    GB: { max: Math.pow(1024, 4), prev: 'MB' },
    TB: { max: Number.MAX_SAFE_INTEGER, prev: 'GB' },
  };

  transform(input: number = 0): any {
    let bytes = input;

    for (const key in BytePipe.formats) {
      if (BytePipe.formats.hasOwnProperty(key)) {
        const format = BytePipe.formats[key];
        if (bytes < format.max) {
          const result = Math.floor(BytePipe.calculateResult(format, bytes));
          return BytePipe.formatResult(result, key);
        }
      }
    }
  }

  static formatResult(result: number, unit: string): string {
    return `${result} ${unit}`;
  }

  static calculateResult(format: { max: number; prev?: ByteUnit }, bytes: number) {
    const prev = format.prev ? BytePipe.formats[format.prev] : undefined;
    return prev ? bytes / prev.max : bytes;
  }
}
