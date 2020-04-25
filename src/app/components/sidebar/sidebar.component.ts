import { Component, OnInit, Input } from '@angular/core';
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

  constructor() { }
}
