import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core';
import { TorrentInformation } from 'src/app/services/transmission.client';
import { Subscription } from 'rxjs';
import { TransmissionMockClient } from 'src/app/services/transmission.mock.client';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() folders: string[] = [];
  @Input() statuses: any;

  selectedFolder: string;
  selectedStatus: string;

  @Output() onSelectFolderEvent = new EventEmitter<string>()
  @Output() onSelectStatusEvent = new EventEmitter<string>()

  constructor() { }

  onFolderClick(folder: string) {
    this.selectedFolder = this.selectedFolder == folder ? '' : folder;
    this.onSelectFolderEvent.emit(this.selectedFolder);
  }

  onStatusClick(status: string) {
    this.selectedStatus = this.selectedStatus == status ? '' : status;
    this.onSelectStatusEvent.emit(this.selectedStatus);
  }
}
