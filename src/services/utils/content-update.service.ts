import { Injectable } from "@angular/core";
import { LastVisitUpdates } from "../../models/lastVisitTimestamps.interface";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ContentUpdateService {
  private eventUpdateObservable = new Subject<number>();
  private broadcastUpdateObservable = new Subject<number>();
  private newsUpdateObservable = new Subject<number>();
  private partageUpdateObservable = new Subject<number>();


  constructor() {}

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


  public resetNbUpdated(content: string) {
    switch (content) {
      case 'broadcasts' : {
        this.updateBroadcastsNb(0);
        break;
      }
      case 'events' : {
        this.updateEventsNb(0);
        break;
      }
      case 'partages' : {
        this.updatePartagesNb(0);
        break;
      }
      case 'news' : {
        this.updateNewsNb(0);
        break;
      }
      default: {
        break;
      }
    }

  }
}
