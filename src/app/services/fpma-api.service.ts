import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { ArticleSpi } from '../models/article-spi.interface';
import { Presentation } from '../models/presentation.interface';
import { Actualities } from '../models/actuality.interface';
import { StkNews } from '../models/stk-news.interface';
import { LastVisitTimestamps, LastVisitUpdates } from '../models/lastVisitTimestamps.interface';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { LiveSection } from '../models/live-section.interface';
import { GenericPost } from '../models/generic-post.interface';

@Injectable({
  providedIn: 'root',
})
export class FpmaApiService {

  private FPMA_DOMAIN = 'https://stk-staging.fpma.church/';
  private isDevMode = false;

  constructor(
    public http: HttpClient
  ) {
  }

  /**
   * Method that retrieve list of events from the stk.fpma api
   */
  public loadAgenda(): Observable<AgendaEvent[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};

    return this.http.get(`${this.FPMA_DOMAIN}api/events`, httpOptions)
      .pipe(
        map((res: any) => this.parseEvent(res)),
        catchError((e: any) => {
          return Observable.throw(e);
      }));
  }

  private parseEvent(elem: any): AgendaEvent[] {
    const events: AgendaEvent[] = [];
    if (elem && elem.events && elem.events.data && elem.events.data.length) {
      elem.events.data.forEach( (event, index) => {
        if (event.startdate) {
          events.push({
            id: index,
            title: event.title,
            startTime: DateHelper.getDate(event.startdate),
            endTime: event.enddate ?  DateHelper.getDate(event.enddate) : DateHelper.getDate(event.startdate),
            text : event.desc,
            thumbnail : this.parseThumbnailUrl(event.image)
          });
        }
      });
    }
    return events;
  }

  /**
   * Method that retrieve list of spi article from the stk.fpma api
   */
  public loadPartageSpi(): Observable<ArticleSpi[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};

    return this.http.get(`${this.FPMA_DOMAIN}api/partages`, httpOptions)
      .pipe(
        map((res: any) => this.parsePartage(res)),
        catchError((e: any) => {
          return Observable.throw(e);
      }));
  }

  private parsePartage(elem: any): ArticleSpi[] {
    const partages: ArticleSpi[] = [];
    if (elem && elem.partages && elem.partages.data && elem.partages.data.length) {
      const partagesElem: any[] = elem.partages.data;
      partagesElem.forEach( partageElem => {
        partages.push({
          title: partageElem.title,
          creationDate: DateHelper.getDate(partageElem.created),
          text: partageElem.fulltext,
          thumbnail: partageElem.thumbnails
        });
      });
    }
    return partages;
  }

  /**
   * Method that retrieve list of actuality from the stk.fpma api
   */
  public loadActuality(): Observable<Actualities[]> {// API-V2 OK
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};
    return this.http.get(`${this.FPMA_DOMAIN}api/broadcasts`, httpOptions)
    .pipe(
      map((res: any) => this.parseActuality(res)),
      catchError((e: any) => {
        return Observable.throw(e);
    }));
  }

  private parseActuality(elem: any): Actualities[] {
    const atualities: Actualities[] = [];
    if (elem && elem.broadcast && elem.broadcast.data && elem.broadcast.data.length) {
      elem.broadcast.data.forEach(atuality => {
        atualities.push({
          title: atuality.title,
          created: DateHelper.getDate(atuality.created),
          text: atuality.fulltext,
          rawtext: atuality.rawtext,
          thumbnail: atuality.thumbnails
        });
      });
    }
    return atualities;
  }

  /**
   * Method that retrieve list of presentation from the stk.fpma api
   */
  public loadPresentations(): Observable<Presentation[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};
    return this.http.get(`${this.FPMA_DOMAIN}api/presentations`, httpOptions)
      .pipe(
        map((res: any) => this.parsePresentations(res)),
        catchError((e: any) => {
          return Observable.throw(e);
      }));
  }

  private parsePresentations(elem: any): Presentation[] {
    const presentations: Presentation[] = [];
    if (elem && elem.presentations && elem.presentations.data && elem.presentations.data.length) {
      elem.presentations.data.forEach(presentation => {
        presentations.push({
          title: presentation.title,
          introtext: presentation.introtext,
          created: DateHelper.getDate(presentation.created),
          text: presentation.fulltext,
          rawtext: presentation.rawtext,
          thumbnail: presentation.thumbnails
        });
      });
    }
    return presentations;
  }

  public loadStkNews(): Observable<StkNews[]> { // API-V2 OK
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};
    return this.http.get(`${this.FPMA_DOMAIN}api/stk-news`, httpOptions)
      .pipe(
        map((res: any) => this.parseStkNews(res)),
        catchError((e: any) => {
          return Observable.throw(e);
      }));
  }

  private parseStkNews(elem: any): StkNews[] { // API-V2 OK
    const news: StkNews[] = [];
    if (elem && elem.news && elem.news.data && elem.news.data.length > 0) {
      const newsElem: any[] = elem.news.data;
      newsElem.forEach( newElem => {
        news.push({
          id: Number(newElem.id),
          title: newElem.title,
          thumbnails: newElem.thumbnails,
          pdf: newElem.files && newElem.files.length > 0 ? `${newElem.files[0]}` : ''
        });
      });
    }
    return news;
  }

  /**
   * Method that retrieve list of live sections from the stk.fpma api
   */
  public loadLiveSections(): Observable<LiveSection[]> {
    return this.http.get(`${this.FPMA_DOMAIN}api/live-sections`)
      .pipe(
        map((res: any) => this.parseLiveSections(res)),
        catchError((e: any) => {
          return Observable.throw(e);
        }));
  }

  private parseLiveSections(elem: any): LiveSection[] {
    const liveSections: LiveSection[] = [];
    if (elem && elem['live-sections'] && elem['live-sections'].data && elem['live-sections'].data.length) {
      elem['live-sections'].data.forEach(liveSection => {
        liveSections.push(liveSection);
      });
    }
    return liveSections;
  }

  /**
   * Method that retrieve list of generic posts from the stk.fpma api
   */
  public loadGenericPosts(category: number): Observable<GenericPost[]> {
    const httpOptions = this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode': ''
      })
    } : {};
    return this.http.get(`${this.FPMA_DOMAIN}api/posts/category/${category}`, httpOptions)
      .pipe(
        map((res: any) => this.parseGenericPosts(res)),
        catchError((e: any) => {
          return Observable.throw(e);
        }));
  }

  private parseGenericPosts(elem: any): GenericPost[] {
    const posts: GenericPost[] = [];
    if (elem && elem.posts && elem.posts.data && elem.posts.data.length) {
      elem.posts.data.forEach(post => {
        posts.push({
          title: post.title,
          created: DateHelper.getDate(post.created),
          introtext: post.introtext,
          fulltext: post.fulltext,
          rawtext: post.rawtext,
          thumbnail: this.parseThumbnailUrl(post.thumbnails)
        });
      });
    }
    return posts;
  }

  /**
   * @deprecated depuis l'api v2. Doit etre utilise seulement pour l'api v1 (presentations, stk-news)
   */
  private parseThumbnailUrls(thumbnailsUrl: any): string[] {
    const thumbnailsArray = [];
    if (thumbnailsUrl && thumbnailsUrl.length) {
      thumbnailsUrl.map((url: string) => {
        if (url.startsWith('http')) {
          thumbnailsArray.push(`${url}`);
        } else {
          thumbnailsArray.push(`${this.FPMA_DOMAIN}${url}`);
        }
      });
      return thumbnailsArray;
    } else {
      return [];
    }
  }

  // Normalement déjà ajouté dans la branche feature/agenda
  private parseThumbnailUrl(thumbnailUrl: any): string {
    if (thumbnailUrl) {
      if (thumbnailUrl.startsWith('http')) {
        return thumbnailUrl;
      } else {
        return `${this.FPMA_DOMAIN}${thumbnailUrl}`;
      }
    } else {
      return null;
    }
  }

  public getContentUpdated(lastVisitTimestamps: LastVisitTimestamps): Observable<LastVisitUpdates> {
    const params = new HttpParams()
                      .set('broadcasts', lastVisitTimestamps.broadcasts.toString())
                      .set('events', lastVisitTimestamps.events.toString())
                      .set('news', lastVisitTimestamps.news.toString())
                      .set('partages', lastVisitTimestamps.partages.toString());
    return this.http.get(`${this.FPMA_DOMAIN}api/content-updates`, { params })
      .pipe(
        map((res: any) => this.parseContentUpdates(res)),
        catchError((e: any) => {
          return Observable.throw(e);
      }));
  }

  private parseContentUpdates(data: any): LastVisitUpdates {
    const contentUpdated = data ? data['content-updates'] : null;
    if ( contentUpdated && contentUpdated.data) {
      return {
        broadcasts: contentUpdated.data.broadcasts,
        events: contentUpdated.data.events,
        news: contentUpdated.data.news,
        partages: contentUpdated.data.partages
      };
    } else {
      return null;
    }
  }

  public activateDevMode() {
    this.isDevMode = true;
  }

  public deactivateDevMode() {
    this.isDevMode = false;
  }
}
