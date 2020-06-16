import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AgendaEvent } from "../../models/agenda-event.interface";
import { DateHelper } from "../utils/date-helper";
import { ArticleSpi } from "../../models/article-spi.interface";
import { Presentation } from "../../models/presentation.interface";
import { Actualities } from "../../models/actuality.interface";
import { StkNews } from "../../models/stk-news.interface";

@Injectable()
export class FpmaApiService {

  private FPMA_DOMAIN = 'https://stk.fpma.church/';

  constructor(
    public http: HttpClient
  ) {
  }

  /**
   * Method that retrieve list of events from the stk.fpma api
   */
  public loadAgenda(): Observable<AgendaEvent[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/events`)
      .map((res: any) => this.parseEvent(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
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

  /**
   * Method that retrieve list of spi article from the stk.fpma api
   */
  public loadPartageSpi(): Observable<ArticleSpi[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/partages`)
      .map((res:any) => this.parsePartage(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
  }

  private parsePartage(elem:any): ArticleSpi[] {
    const partages: ArticleSpi[] = [];
    if (elem && elem.partages && elem.partages.data && elem.partages.data.length) {
      elem.partages.data.forEach(partage => {
        partages.push({
          id: partage.id,
          creationDate: DateHelper.getDate(partage.created),
          title: partage.title,
          text: partage.rawtext,// for now full text of partage are sent in introtext
          thumbnail: this.parseThumbnailUrls(partage.thumbnails)
        })
      })
    }
    return partages;
  }

  /**
   * Method that retrieve list of actuality from the stk.fpma api
   */
  public loadActuality(): Observable<Actualities[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/broadcasts`)
      .map((res:any) => this.parseActuality(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
  }

  private parseActuality(elem: any): Actualities[] {
    const atualities: Actualities[] = [];
    if (elem && elem.broadcast && elem.broadcast.data && elem.broadcast.data.length) {
      elem.broadcast.data.forEach(atuality => {
        atualities.push({
          id: atuality.id,
          title: atuality.title,
          created: DateHelper.getDate(atuality.created),
          text: atuality.introtext,
          rawtext: atuality.rawtext,
          thumbnail: this.parseThumbnailUrls(atuality.thumbnails)
        })
      })
    }
    return atualities;
  }

  /**
   * Method that retrieve list of presentation from the stk.fpma api
   */
  public loadPresentations(): Observable<Presentation[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/presentations`)
      .map((res:any) => this.parsePresentations(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
  }

  private parsePresentations(elem: any): Presentation[] {
    const presentations: Presentation[] = [];
    if (elem && elem.presentations && elem.presentations.data && elem.presentations.data.length) {
      elem.presentations.data.forEach(presentation => {
        presentations.push({
          id: presentation.id,
          title: presentation.title,
          introtext: presentation.introtext,
          created: DateHelper.getDate(presentation.created),
          text: presentation.rawtext,
          thumbnail: this.parseThumbnailUrls(presentation.thumbnails)
        })
      })
    }
    return presentations;
  }

  public loadPresentation(id: number): Observable<Presentation | null> {
    return this.http.get(`${this.FPMA_DOMAIN}api/presentations/${id}`)
      .map((res:any) => this.parsePresentation(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
  }

  private parsePresentation(elem: any): Presentation | null {
    if (elem && elem.presentations && elem.presentations.data ) {
      const presentation = elem.presentations.data;
      return {
        id: presentation.id,
        title: presentation.title,
        introtext: presentation.introtext,
        created: DateHelper.getDate(presentation.created),
        text: presentation.rawtext,
        thumbnail: this.parseThumbnailUrls(presentation.thumbnails)
      }
    } else {
      return null;
    }
  }


  public loadStkNews(): Observable<StkNews[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/news`)
      .map((res: any) => this.parseStkNews(res))
      .catch((e: any) => {
        return Observable.throw(e);
    })
  }

  private parseStkNews(elem: any): StkNews[] {
    const news: StkNews[] = [];
    if (elem && elem.news && elem.news.data && elem.news.data.length > 0) {
      const newsElem: any[] = elem.news.data;
      newsElem.forEach( newElem => {
        news.push({
          id: Number(newElem.id),
          title: newElem.title,
          thumbnails: this.parseThumbnailUrls(newElem.thumbnails),
          pdf: newElem.files && newElem.files.length > 0 ? `${this.FPMA_DOMAIN}${newElem.files[0]}` : ''
        })
      })
    }
    return news;
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
