import { Component, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransmissionMockClient } from './services/transmission.mock.client';
import { TorrentInformation } from './services/transmission.client';
import { repeat, delay, repeatWhen } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private FIELDS: string[] = [
    'id',
    'error',
    'errorString',
    'eta',
    'isFinished',
    'isStalled',
    'leftUntilDone',
    'metadataPercentComplete',
    'peersConnected',
    'peersGettingFromUs',
    'peersSendingToUs',
    'percentDone',
    'queuePosition',
    'rateDownload',
    'rateUpload',
    'recheckProgress',
    'seedRatioMode',
    'seedRatioLimit',
    'sizeWhenDone',
    'status',
    'trackers',
    'downloadDir',
    'uploadedEver',
    'uploadRatio',
    'webseedsSendingToUs',
  ];

  title = 'transmission-web-ui';
  torrents: TorrentInformation[] = [];
  torrentsFilter: string = '';
  folders: string[] = [];
  error: string; //todo: error type
  torrentsSubscription: Subscription;

  constructor(private transmissionService: TransmissionMockClient) {}

  ngOnInit(): void {
    //Request all data
    this.transmissionService
      .torrentGet({ ids: [], fields: this.FIELDS })
      .subscribe((t) => this.initData(t))
      .unsubscribe();

    this.torrentsSubscription = this.transmissionService
      .torrentGet({ ids: 'recently-active', fields: this.FIELDS })
      .pipe(
        repeatWhen(s=>s.pipe(delay(1000)))
      )
      .subscribe(
        (torrents) => {
          this.mergeData(torrents);
        },
        (error) => {
          this.torrents = [];
          this.error = error.message;
        }
      );
  }

  initData(torrents: TorrentInformation[]) {
    const folders =
      this.torrents
        .map((t) => t.downloadDir.split('/').reverse()[0])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort() || [];

    this.torrents = torrents;
    this.folders = folders;
  }

  mergeData(torrents: TorrentInformation[]) {
    const folders =
      this.torrents
        .map((t) => t.downloadDir.split('/').reverse()[0])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort() || [];

    //update recently active torrents
    torrents.forEach((newTorrent) => {
      const prevTorrentIndex = this.torrents.findIndex(
        (t) => t.id === newTorrent.id
      );

      if (prevTorrentIndex === -1) this.torrents.push(newTorrent);
      else this.torrents.splice(prevTorrentIndex, 1, newTorrent);
    });

    //update folders
    this.folders = folders;
  }

  searchValueChange(srchValue: any) {
    this.torrentsFilter = srchValue;
  }

  ngOnDestroy(): void {
    this.torrentsSubscription.unsubscribe();
  }
}
