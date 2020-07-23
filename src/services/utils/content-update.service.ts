import { Injectable } from "@angular/core";
import { LastVisitUpdates } from "../../models/lastVisitTimestamps.interface";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/Observable";

@Injectable()
export class ContentUpdateService {
  private nbBroadcastsUpdated: number;
  private nbNewsUpdated: number;
  private nbEventsUpdated: number;
  private nbPartagesUpdated: number;

  constructor() {}

  public initNbUpdated(lastVisitUpdated: LastVisitUpdates) {
    this.nbBroadcastsUpdated = lastVisitUpdated.broadcasts;
    this.nbEventsUpdated = lastVisitUpdated.events;
    this.nbNewsUpdated = lastVisitUpdated.news;
    this.nbPartagesUpdated = lastVisitUpdated.partages;
  }

  public getNbBroadcastsUpdated(): Observable<number> {
    return of(this.nbBroadcastsUpdated);
  }

  public getNbNewsUpdated(): Observable<number> {
    return of(this.nbNewsUpdated);
  }

  public getNbEventsUpdated(): Observable<number> {
    return of(this.nbEventsUpdated);
  }

  public getNbPartagesUpdated(): Observable<number> {
    return of(this.nbPartagesUpdated);
  }

  public resetNbUpdated(content: string) {
    switch (content) {
      case 'broadcasts' : {
        this.nbBroadcastsUpdated = 0;
        break;
      }
      case 'events' : {
        this.nbEventsUpdated = 0;
        break;
      }
      case 'partages' : {
        this.nbPartagesUpdated = 0;
        break;
      }
      case 'news' : {
        this.nbNewsUpdated = 0;
        break;
      }
      default: {
        break;
      }
    }
    
  }
}