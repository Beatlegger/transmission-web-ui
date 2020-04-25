import { Component, Input } from '@angular/core';
import {
  TorrentInformation,
} from '../../services/transmission.client';

@Component({
  selector: 'app-torrent-list',
  templateUrl: './torrent-list.component.html',
  styleUrls: ['./torrent-list.component.css'],
})
export class TorrentListComponent {
  @Input() filter: string = '';
  @Input() torrents: TorrentInformation[] = [];

  constructor() {}
}
