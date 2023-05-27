import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LastVisitTimestamps } from '../models/lastVisitTimestamps.interface';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ContentUpdateService {
  private eventUpdateObservable = new Subject<boolean>();
  private broadcastUpdateObservable = new Subject<boolean>();
  private newsUpdateObservable = new Subject<boolean>();
  private partageUpdateObservable = new Subject<boolean>();


  constructor(private storage: StorageService) {}

  public initUpdatedStatus(storedVisitTimestamp: LastVisitTimestamps, lastVisitTimestamp: LastVisitTimestamps) {
    this.updateBroadcastsStatus(storedVisitTimestamp.broadcasts < lastVisitTimestamp.broadcasts);
    this.updateEventsStatus(storedVisitTimestamp.events < lastVisitTimestamp.events);
    this.updateNewsStatus(storedVisitTimestamp.news < lastVisitTimestamp.news);
    this.updatePartagesStatus(storedVisitTimestamp.partages < lastVisitTimestamp.partages);
  }

  public getEventUpdateObservable(): Observable<boolean> {
    return this.eventUpdateObservable.asObservable();
  }
  public getBroadcastUpdateObservable(): Observable<boolean> {
    return this.broadcastUpdateObservable.asObservable();
  }
  public getNewsUpdateObservable(): Observable<boolean> {
    return this.newsUpdateObservable.asObservable();
  }
  public getPartageUpdateObservable(): Observable<boolean> {
    return this.partageUpdateObservable.asObservable();
  }

  public updateBroadcastsStatus(nbBroadcastssUpdated: boolean): void {
    this.broadcastUpdateObservable.next(nbBroadcastssUpdated);
  }

  public updateEventsStatus(nbEventsUpdated: boolean): void {
    this.eventUpdateObservable.next(nbEventsUpdated);
  }
  public updateNewsStatus(nbNewsUpdated: boolean): void {
    this.newsUpdateObservable.next(nbNewsUpdated);
  }
  public updatePartagesStatus(nbPartagesUpdated: boolean): void {
    this.partageUpdateObservable.next(nbPartagesUpdated);
  }

  public updateEpochTimeStored(content: keyof LastVisitTimestamps) {
    return this.storage.get<LastVisitTimestamps>('lastVisitTimestamp').then(contentsEpochTime => {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        contentsEpochTime[content] = secondsSinceEpoch;
        return this.storage.set('lastVisitTimestamp', contentsEpochTime);
    });
  }

  public resetNbUpdated(content: keyof LastVisitTimestamps) {
    switch (content) {
      case 'broadcasts' : {
        this.updateBroadcastsStatus(false);
        void this.updateEpochTimeStored('broadcasts');
        break;
      }
      case 'events' : {
        this.updateEventsStatus(false);
        void this.updateEpochTimeStored('events');
        break;
      }
      case 'partages' : {
        this.updatePartagesStatus(false);
        void this.updateEpochTimeStored('partages');
        break;
      }
      case 'news' : {
        this.updateNewsStatus(false);
        void this.updateEpochTimeStored('news');
        break;
      }
      default: {
        break;
      }
    }

  }

}
