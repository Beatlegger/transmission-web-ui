import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Output() onSearchChange = new EventEmitter<string>()
  
  constructor() {}

  searchChanged(event: string) {
    this.onSearchChange.emit(event);
  }
}
