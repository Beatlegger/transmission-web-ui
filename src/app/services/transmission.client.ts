import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  throwError
} from 'rxjs';
import { map, catchError, repeat, retry, delay, repeatWhen, retryWhen } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface ITransmissionClient {
  torrentGet(args: TorrentGetArguments): Observable<TorrentInformation[]>;
}

@Injectable({ providedIn: 'root' })
export class TransmissionClient implements ITransmissionClient {

  private host: string = environment.transmissionURI;
  private key: string = '';

  constructor(private httpClient: HttpClient) {}

  public torrentGet(args: TorrentGetArguments): Observable<TorrentInformation[]> {
    const request = this.createRequest("torrent-get", args);
    return this.post<TorrentInformation[]>(request);
  }

  public torrentAdd(args: TorrentAddArguments) : TorrentAddResponse { //todo: response type for method
    const request = this.createRequest("torrent-add", args);
    return this.post<TorrentAddResponse>(request);
  }

  private createRequest<T>(method: string, data: T) {
    return {
      arguments: data,
      method: method,
    }
  }

  private post<T>(data: any): Observable<T> {

    const buildHeaders = () => {
      const headers = {
        'Content-Type': 'application/json-rpc',
        'X-Transmission-Session-Id': this.key,
      };

      return new HttpHeaders(headers);
    };

    const handleError = (error: HttpErrorResponse) => {
      if (error.status == 409) {
        this.key = error.headers.get('X-Transmission-Session-Id');
        return this.httpClient.post<TransmissionResponse<T>>(this.host, data, {
          headers: buildHeaders(),
          observe: 'response',
        });
      }

      return throwError(error);
    };

    return this.httpClient
      .post<TransmissionResponse<T>>(this.host, data, { 
        headers: buildHeaders(), 
        observe: 'response' })
      .pipe(
        catchError(handleError),
        map((r) => r.body.arguments)
      );
  }
}

export class TorrentInformation {
  id: number;
  name: string;
  percentDone: number;
  rateDownload: number;
  rateUpload: number; 
  downloadDir: string;
  error: number;
  errorString: string;
  status: number;
}

export class TorrentGetArguments {
  fields: string[];
  ids: number[] | string;
}


export class TorrentAddResponse {
  //todo: response
}

export interface TorrentAddArguments {
  cookies: string;
  downloadDir: string;
  filename: string;
  metainfo: string;
  paused: boolean;
  peerLimit: number;
  bandwidthPriority: number;
  filesWanted: any[];
  filesUnwanted: any[];
  priorityHigh: any[];
  priorityLow: any[];
  priority: any[];
}

export interface TransmissionResponse<T> {
  arguments: T;
  result: string;
  tag: string;
}
