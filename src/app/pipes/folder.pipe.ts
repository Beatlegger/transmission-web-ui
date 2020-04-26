import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'folder'
})
export class FolderPipe implements PipeTransform {

  transform(path: string): string {
    return path.split("/").reverse()[0]; //todo: split windows directories
  }

}
