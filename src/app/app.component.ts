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
  statuses: any = {
    all: 0,
    faulted: 0,
    queued: 0,
    checking: 0,
    stopped: 0,
    downloading: 0,
    seeding: 0
  };
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
        repeatWhen(s=>s.pipe(delay(5000)))
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
    this.statuses = {
      all: this.torrents.length,
      faulted: this.torrents.filter(t=>t.error).length,
      queued: this.torrents.filter(t=> [1, 3, 5].includes(t.status) && t.error === 0).length,
      stopped: this.torrents.filter(t=> t.status === 0 && t.error === 0).length,
      checking: this.torrents.filter(t=> t.status === 2 && t.error === 0).length,
      downloading: this.torrents.filter(t=> t.status === 4 && t.error === 0).length,
      seeding: this.torrents.filter(t=> t.status === 6 && t.error === 0).length,
    };
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

    this.statuses = {
      all: this.torrents.length,
      faulted: this.torrents.filter(t=>t.error).length,
      queued: this.torrents.filter(t=> [1, 3, 5].includes(t.status) && t.error === 0).length,
      stopped: this.torrents.filter(t=> t.status === 0 && t.error === 0).length,
      checking: this.torrents.filter(t=> t.status === 2 && t.error === 0).length,
      downloading: this.torrents.filter(t=> t.status === 4 && t.error === 0).length,
      seeding: this.torrents.filter(t=> t.status === 6 && t.error === 0).length,
    };
  }

  searchValueChange(srchValue: any) {
    this.torrentsFilter = srchValue;
  }

  ngOnDestroy(): void {
    this.torrentsSubscription.unsubscribe();
  }
}
