import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { ArticleSpi } from '../models/article-spi.interface';
import { Presentation } from '../models/presentation.interface';
import { Actualities } from '../models/actuality.interface';
import { StkNews } from '../models/stk-news.interface';
import { LastVisitTimestamps, LastVisitUpdates } from '../models/lastVisitTimestamps.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LiveSection } from '../models/live-section.interface';
import { GenericPost } from '../models/generic-post.interface';
import { PlayerService } from './player-service';

@Injectable({
  providedIn: 'root',
})
export class FpmaApiService {

  private FPMA_DOMAIN = 'https://stk.fpma.church/';
  readonly isDevMode$ = new BehaviorSubject(false);
  get isDevMode(): boolean {
    return this.isDevMode$.value;
  }
  set isDevMode(v: boolean) {
    this.isDevMode$.next(v);
  }

  constructor(
    public http: HttpClient,
    private playerService: PlayerService
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
        map((res: any) => {
          const events: AgendaEvent[] = [];
          if (res && res.events && res.events.data && res.events.data.length) {
            res.events.data.forEach((event, index) => {
              if (event.startdate) {
                let e: AgendaEvent = this.parseEvent(event);
                e.id = index;
                events.push(e);
              }
            });
          }
          return events;
        }),
      );
  }

  public loadMonthsEventsAgenda(month: String, year: String): Observable<AgendaEvent[]>{
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};
    return this.http.get(`${this.FPMA_DOMAIN}api/events/${year}/${month}`, httpOptions)
      .pipe(
        map((res: any) => {
          const events: AgendaEvent[] = [];
          if (res && res.events && res.events.data && res.events.data.length) {
            res.events.data.forEach((event, index) => {
              if (event.startdate) {
                let e: AgendaEvent = this.parseEvent(event);
                e.id = index;
                events.push(e);
              }
            });
          }
          return events;
        }),
      );
  }

  public loadAgendaById(id: number): Observable<AgendaEvent> {
    return this.http.get(`${this.FPMA_DOMAIN}api/events/${id}`)
      .pipe(
        map((res: any) => {
          if (res && res.events && res.events.data) {
            return this.parseEvent(res.events.data);
          }
          return null;
        }),
        catchError((e: any) => {
          return Observable.throw(e);
        }));
  }

  private parseEvent(elem: any): AgendaEvent {
    return {
        id: -1,
        title: elem.title,
        startTime: DateHelper.getDate(elem.startdate),
        endTime: elem.enddate ?  DateHelper.getDate(elem.enddate) : DateHelper.getDate(elem.startdate),
        text : elem.desc,
        thumbnail : this.parseThumbnailUrl(elem.image)
    };
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
        map((res: any) => {
          let partages: ArticleSpi[] = [];
          if (res && res.partages && res.partages.data && res.partages.data.length) {
            const partagesElem: any[] = res.partages.data;
            partagesElem.forEach(partage => {
              partages.push(this.parsePartage(partage));
            });
          }
          return partages;
        }),
      );
  }

  public loadPartageSpiWithStart(start:  string): Observable<ArticleSpi[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      }) ,
      params : new HttpParams().set('start' , start)
    } : { params : new HttpParams().set('start' , start)};

    return this.http.get(`${this.FPMA_DOMAIN}api/partages`, httpOptions)
      .pipe(
        map((res: any) => {
          let partages: ArticleSpi[] = [];
          if (res && res.partages && res.partages.data && res.partages.data.length) {
            const partagesElem: any[] = res.partages.data;
            partagesElem.forEach(partage => {
              partages.push(this.parsePartage(partage));
            });
          }
          return partages;
        }),
      );
  }

  public loadPartageSpiById(id: number): Observable<ArticleSpi> {
    return this.http.get(`${this.FPMA_DOMAIN}api/partages/${id}`)
      .pipe(
        map((res: any) => {
          if (res && res.partages && res.partages.data) {
            return this.parsePartage(res.partages.data);
          }
          return null;
        }),
        catchError((e: any) => {
          return Observable.throw(e);
        }));
  }

  private parsePartage(elem: any): ArticleSpi {
    return {
      title: elem.title,
      creationDate: DateHelper.getDate(elem.created),
      text: this.playerService.enablePlayableEmbededContent(elem.fulltext),
      thumbnail: elem.thumbnails
    }
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
        map((res: any) => {
          const actualities: Actualities[] = [];
          if (res && res.broadcast && res.broadcast.data && res.broadcast.data.length) {
            res.broadcast.data.forEach(actuality => {
              actualities.push(this.parseActuality(actuality));
            });
          }
          return actualities;
        }),
    );
  }

  public loadActualityWithStart(start:  string): Observable<Actualities[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      }) ,
      params : new HttpParams().set('start' , start)
    } : { params : new HttpParams().set('start' , start)};

    return this.http.get(`${this.FPMA_DOMAIN}api/broadcasts`, httpOptions)
      .pipe(
        map((res: any) => {
          const actualities: Actualities[] = [];
          if (res && res.broadcast && res.broadcast.data && res.broadcast.data.length) {
            res.broadcast.data.forEach(actuality => {
              actualities.push(this.parseActuality(actuality));
            });
          }
          return actualities;
        }),);
  }

  public loadActualityById(id: number): Observable<Actualities> {
    return this.http.get(`${this.FPMA_DOMAIN}api/broadcasts/${id}`)
      .pipe(
        map((res: any) => {
          if (res && res.broadcast && res.broadcast.data) {
            return this.parseActuality(res.broadcast.data);
          }
          return null;
        }),
        catchError((e: any) => {
          return Observable.throw(e);
        }));
  }

  private parseActuality(elem: any): Actualities {
    return {
          title: elem.title,
          created: DateHelper.getDate(elem.created),
          text: this.playerService.enablePlayableEmbededContent(elem.fulltext),
          rawtext: elem.rawtext,
          thumbnail: elem.thumbnails
    };
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
        );
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

    );
  }

  public loadStkNewsWithStart(start:  string): Observable<StkNews[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      }) ,
      params : new HttpParams().set('start' , start)
    } : { params : new HttpParams().set('start' , start)};

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
        );
  }

  private parseLiveSections(elem: any): LiveSection[] {
    const liveSections: LiveSection[] = [];
    if (elem?.['live-sections']?.data?.length) {
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
        );
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
        );
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
