import { Pipe, PipeTransform } from '@angular/core';
import { TorrentInformation } from '../services/transmission.client';
import { FilterModel } from '../models/filter.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(torrents: TorrentInformation[], filter: FilterModel) : TorrentInformation[] {
    //filter by name
    var torrentsResult = torrents.filter(torrent => torrent.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1);
    
    //filter by status
    if(filter.status)
    {
      switch(filter.status) {
        case 'faulted': {
          torrentsResult = torrentsResult.filter(torrent => torrent.error); 
          break;
        }
        case 'queued': {
          torrentsResult = torrentsResult.filter(torrent => [1,3,5].includes(torrent.status) && torrent.error == 0); 
          break;
        }
        case 'stopped': {
          torrentsResult = torrentsResult.filter(torrent => [0].includes(torrent.status) && torrent.error == 0); 
          break;
        }
        case 'checking': {
          torrentsResult = torrentsResult.filter(torrent => [2].includes(torrent.status) && torrent.error == 0); 
          break;
        }
        case 'downloading': {
          torrentsResult = torrentsResult.filter(torrent => [4].includes(torrent.status) && torrent.error == 0); 
          break;
        }
        case 'seeding': {
          torrentsResult = torrentsResult.filter(torrent => [6].includes(torrent.status) && torrent.error == 0); 
          break;
        }
        //...
      }
      
    }

    //filter by folder
    if(filter.folder.length)
      torrentsResult = torrentsResult.filter(torrent => filter.folder.includes(torrent.downloadDir.split('/').reverse()[0]));
    
    return torrentsResult;
  }
}