import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, Subject } from 'rxjs';
import { LastVisitTimestamps, LastVisitUpdates } from '../models/lastVisitTimestamps.interface';

@Injectable({
  providedIn: 'root',
})
export class ContentUpdateService {
  private eventUpdateObservable = new Subject<number>();
  private broadcastUpdateObservable = new Subject<number>();
  private newsUpdateObservable = new Subject<number>();
  private partageUpdateObservable = new Subject<number>();


  constructor(private storage: Storage) {}

  public initNbUpdated(lastVisitUpdated: LastVisitUpdates) {
    this.updateBroadcastsNb(lastVisitUpdated.broadcasts);
    this.updateEventsNb(lastVisitUpdated.events);
    this.updateNewsNb(lastVisitUpdated.news);
    this.updatePartagesNb(lastVisitUpdated.partages);
  }

  public getEventUpdateObservable(): Observable<number> {
    return this.eventUpdateObservable.asObservable();
  }
  public getBroadcastUpdateObservable(): Observable<number> {
    return this.broadcastUpdateObservable.asObservable();
  }
  public getNewsUpdateObservable(): Observable<number> {
    return this.newsUpdateObservable.asObservable();
  }
  public getPartageUpdateObservable(): Observable<number> {
    return this.partageUpdateObservable.asObservable();
  }

  public updateBroadcastsNb(nbBroadcastssUpdated: number): void {
    this.broadcastUpdateObservable.next(nbBroadcastssUpdated);
  }

  public updateEventsNb(nbEventsUpdated: number): void {
    this.eventUpdateObservable.next(nbEventsUpdated);
  }
  public updateNewsNb(nbNewsUpdated: number): void {
    this.newsUpdateObservable.next(nbNewsUpdated);
  }
  public updatePartagesNb(nbPartagesUpdated: number): void {
    this.partageUpdateObservable.next(nbPartagesUpdated);
  }

  public updateEpochTimeStored(content: keyof LastVisitTimestamps): void {
    this.storage.get('lastVisitTimestamp').then((val: LastVisitTimestamps) => {
        let contentsEpochTime: LastVisitTimestamps;
        contentsEpochTime = val;
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        contentsEpochTime[content] = secondsSinceEpoch;
        this.storage.set('lastVisitTimestamp', contentsEpochTime);
    });
  }

  public resetNbUpdated(content: keyof LastVisitTimestamps) {
    switch (content) {
      case 'broadcasts' : {
        this.updateBroadcastsNb(0);
        this.updateEpochTimeStored('broadcasts');
        break;
      }
      case 'events' : {
        this.updateEventsNb(0);
        this.updateEpochTimeStored('events');
        break;
      }
      case 'partages' : {
        this.updatePartagesNb(0);
        this.updateEpochTimeStored('partages');
        break;
      }
      case 'news' : {
        this.updateNewsNb(0);
        this.updateEpochTimeStored('news');
        break;
      }
      default: {
        break;
      }
    }

  }

}
