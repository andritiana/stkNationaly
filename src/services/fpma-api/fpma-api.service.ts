import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AgendaEvent } from "../../models/agenda-event.interface";
import { DateHelper } from "../utils/date-helper";
import { ArticleSpi } from "../../models/article-spi.interface";

@Injectable()
export class FpmaApiService {
  
  private FPMA_DOMAIN = 'http://stk.fpma.net/';

  constructor(
    public http: HttpClient
  ) { 
  }

  /**
   * Method that retrieve list of events from the stk.fpma api
   */
  loadAgenda(): Observable<AgendaEvent[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/events`)
      .map((res: any) => this.parseEvent(res))
  }

  /**
   * Method that retrieve list of spi article from the stk.fpma api
   */
  loadPartageSpi(): Observable<ArticleSpi[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/partages`)
      .map((res:any) => this.parsePartage(res))
  }

  private parseEvent(elem: any): AgendaEvent[] {
    const events: AgendaEvent[] = [];
    if (elem && elem.events && elem.events.data && elem.events.data.length) {
      elem.events.data.forEach(event => {
        events.push({ 
          id: event.id, 
          title: event.title, 
          startDate: DateHelper.getDate(event.startdate), 
          endDate: DateHelper.getDate(event.enddate)
        })
      })
    }
    return events;
  }

  private parsePartage(elem:any): ArticleSpi[] {
    const partages: ArticleSpi[] = [];
    if (elem && elem.partages && elem.partages.data && elem.partages.data.length) {
      elem.partages.data.forEach(partage => {
        partages.push({
          id: partage.id,
          creationDate: new Date(partage.created),
          title: partage.title,
          text: partage.rawtext,// for now full text of partage are sent in introtext
          thumbnail: this.parseThumbnailUrls(partage.thumbails) 
        })
      })
    }
    return partages;
  }

  private parseThumbnailUrls(thumbnailsUrl: any): string[] {
    const thumbnailsArray = [];
    if (thumbnailsUrl && thumbnailsUrl.length) {
      thumbnailsUrl.map((url: string) => {
        thumbnailsArray.push(`${this.FPMA_DOMAIN}${url}`);
      })
      return thumbnailsArray;
    } else {
      return [];
    }
  }
}