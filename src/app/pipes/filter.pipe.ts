import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], field: string, filter: string): any[] {
    return value.filter(item => item[field].toLowerCase().indexOf(filter.toLowerCase()) !== -1)
  }
}
