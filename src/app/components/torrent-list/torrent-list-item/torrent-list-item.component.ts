import { Component, Input } from '@angular/core';
import { TorrentInformation } from 'src/app/services/transmission.client';

@Component({
  selector: 'app-torrent-list-item',
  templateUrl: './torrent-list-item.component.html',
  styleUrls: ['./torrent-list-item.component.css']
})
export class TorrentListItemComponent {

  @Input() 
  torrent : TorrentInformation;

  @Input()
  index: number;

  constructor() { }
}
