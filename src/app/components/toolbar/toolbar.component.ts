import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Output() filterNameChangeEvent = new EventEmitter<string>()
  
  constructor() { 
    this.searchChanged = this.searchChanged.bind(this);
  }

  searchChanged(event: string) {
    this.filterNameChangeEvent.next(event);
  }
}
