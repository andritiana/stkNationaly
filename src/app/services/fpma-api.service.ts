import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { BehaviorSubject, map } from 'rxjs';
import type { Actualities } from '../models/actuality.interface';
import type { AgendaEvent } from '../models/agenda-event.interface';
import type { ArticleSpi } from '../models/article-spi.interface';
import type { GenericPost } from '../models/generic-post.interface';
import type { LastVisitTimestamps } from '../models/lastVisitTimestamps.interface';
import type { LiveSection } from '../models/live-section.interface';
import type { Presentation } from '../models/presentation.interface';
import type { StkNews } from '../models/stk-news.interface';
import { DateHelper } from '../utils/date-helper';

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

    return this.http.get<APIResponse<'events', RawEvent[]>>(`${this.FPMA_DOMAIN}api/events`, httpOptions)
      .pipe(
        map(res => {
          const events: AgendaEvent[] = [];
          if (res?.events?.data?.length) {
            res.events.data.forEach((event, index) => {
              if (event.startdate) {
                const e: AgendaEvent = this.parseEvent(event);
                e.id = index;
                events.push(e);
              }
            });
          }
          return events;
        }),
      );
  }

  public loadMonthsEventsAgenda(month: string, year: string): Observable<AgendaEvent[]>{
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      })
    } : {};
    return this.http.get<APIResponse<'events', RawEvent[]>>(`${this.FPMA_DOMAIN}api/events/${year}/${month}`, httpOptions)
      .pipe(
        map(res => {
          const events: AgendaEvent[] = [];
          if (res?.events?.data?.length) {
            res.events.data.forEach((event, index) => {
              if (event.startdate) {
                const e: AgendaEvent = {
                  ...this.parseEvent(event),
                  id: index,
                };
                events.push(e);
              }
            });
          }
          return events;
        }),
      );
  }

  public loadAgendaById(id: number): Observable<AgendaEvent | null> {
    return this.http.get<APIResponse<'events', RawEvent>>(`${this.FPMA_DOMAIN}api/events/${id}`)
      .pipe(
        map(res => {
          if (res?.events?.data) {
            return this.parseEvent(res.events.data);
          }
          return null;
        }),
      );
  }

  private parseEvent(elem: RawEvent): AgendaEvent {
    return {
      id: -1,
      title: elem.title,
      startTime: DateHelper.getDate(elem.startdate),
      endTime: elem.enddate ?  DateHelper.getDate(elem.enddate) : DateHelper.getDate(elem.startdate),
      text : elem.desc,
      thumbnail: this.parseThumbnailUrl(elem.image),
      allDay: false,
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

    return this.http.get<APIResponse<'partages', RawPartage[]>>(`${this.FPMA_DOMAIN}api/partages`, httpOptions)
      .pipe(
        map(res => {
          if (res?.partages?.data?.length) {
            const partagesElem: RawPartage[] = res.partages.data;
            return partagesElem.map(partage =>
              this.parsePartage(partage)
            );
          }
          return [];
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

    return this.http.get<APIResponse<'partages', RawPartage[]>>(`${this.FPMA_DOMAIN}api/partages`, httpOptions)
      .pipe(
        map(res => {
          if (res && res.partages && res.partages.data && res.partages.data.length) {
            const partagesElem: RawPartage[] = res.partages.data;
            return partagesElem.map(partage =>
              this.parsePartage(partage)
            );
          }
          return [];
        }),
      );
  }

  public loadPartageSpiById(id: number): Observable<ArticleSpi | null> {
    return this.http.get<APIResponse<'partages', RawPartage>>(`${this.FPMA_DOMAIN}api/partages/${id}`)
      .pipe(
        map(res => {
          if (res?.partages?.data) {
            return this.parsePartage(res.partages.data);
          }
          return null;
        }),
      );
  }

  private parsePartage(elem: RawPartage): ArticleSpi {
    return {
      title: elem.title,
      creationDate: DateHelper.getDate(elem.created),
      text: elem.fulltext,
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
    return this.http.get<APIResponse<'broadcast', RawBroadcast[]>>(`${this.FPMA_DOMAIN}api/broadcasts`, httpOptions)
      .pipe(
        map(res => {
          const actualities: Actualities[] = [];
          if (res?.broadcast?.data?.length) {
            res.broadcast.data.forEach(actuality => {
              actualities.push(this.parseActuality(actuality));
            });
          }
          return actualities;
        }),
    );
  }

  public loadActualityWithStart(start:  string): Observable<Actualities[]> {
    const httpOptions = {
      ...this.isDevMode
        ? {
          headers: new HttpHeaders({
            'dev-mode': ''
          })
        }
        : {},
      params : new HttpParams().set('start' , start)
    };

    return this.http.get<APIResponse<'broadcast', RawBroadcast[]>>(`${this.FPMA_DOMAIN}api/broadcasts`, httpOptions)
      .pipe(
        map(res => {
          const actualities: Actualities[] = [];
          if (res?.broadcast?.data?.length) {
            res.broadcast.data.forEach(actuality => {
              actualities.push(this.parseActuality(actuality));
            });
          }
          return actualities;
        }),);
  }

  public loadActualityById(id: number): Observable<Actualities | null> {
    return this.http.get<APIResponse<'broadcast', RawBroadcast>>(`${this.FPMA_DOMAIN}api/broadcasts/${id}`)
      .pipe(
        map(res => {
          if (res?.broadcast?.data) {
            return this.parseActuality(res.broadcast.data);
          }
          return null;
        }),
      );
  }

  private parseActuality(elem: RawBroadcast): Actualities {
    return {
          title: elem.title,
          created: DateHelper.getDate(elem.created),
          text: elem.fulltext,
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
    return this.http.get<APIResponse<'presentations', RawPresentation[]>>(`${this.FPMA_DOMAIN}api/presentations`, httpOptions)
      .pipe(
        map(res => this.parsePresentations(res)),
        );
  }

  private parsePresentations(elem: APIResponse<'presentations', RawPresentation[]>): Presentation[] {
    const presentations: Presentation[] = [];
    if (elem?.presentations?.data?.length) {
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
    return this.http.get<APIResponse<"news", any[]>>(`${this.FPMA_DOMAIN}api/stk-news`, httpOptions)
      .pipe(
        map(res => this.parseStkNews(res)),

    );
  }

  public loadStkNewsWithStart(start:  string): Observable<StkNews[]> {
    const httpOptions =  this.isDevMode ? {
      headers: new HttpHeaders({
        'dev-mode':  ''
      }) ,
      params : new HttpParams().set('start' , start)
    } : { params : new HttpParams().set('start' , start)};

    return this.http.get<APIResponse<'news', RawNews[]>>(`${this.FPMA_DOMAIN}api/stk-news`, httpOptions)
      .pipe(
        map(res => this.parseStkNews(res)),
      );
  }

  private parseStkNews(elem: APIResponse<'news', RawNews[]>): StkNews[] { // API-V2 OK
    const news: StkNews[] = [];
    if (elem?.news?.data?.length > 0) {
      const newsElem = elem.news.data;
      newsElem.forEach( newElem => {
        news.push({
          id: Math.floor(Math.random() * newsElem.length), // FIXME add id in the response
          title: newElem.title,
          thumbnails: newElem.thumbnails,
          pdf: newElem?.files?.[0]?.toString() ?? ''
        });
      });
    }
    return news;
  }

  /**
   * Method that retrieve list of live sections from the stk.fpma api
   */
  public loadLiveSections(): Observable<LiveSection[]> {
    return this.http.get<APIResponse<'live-sections', RawLiveSection[]>>(`${this.FPMA_DOMAIN}api/live-sections`)
      .pipe(
        map(res => this.parseLiveSections(res)),
        );
  }

  private parseLiveSections(elem: APIResponse<'live-sections', RawLiveSection[]>): LiveSection[] {
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
    return this.http.get<APIResponse<'posts', RawGenericPost[]>>(`${this.FPMA_DOMAIN}api/posts/category/${category}`, httpOptions)
      .pipe(
        map(res => this.parseGenericPosts(res)),
        );
  }

  private parseGenericPosts(elem: APIResponse<'posts', RawGenericPost[]>): GenericPost[] {
    const posts: GenericPost[] = [];
    if (elem?.posts?.data?.length) {
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

  private parseThumbnailUrl(thumbnailUrl: string): string {
    if (thumbnailUrl) {
      if (thumbnailUrl.startsWith('http')) {
        return thumbnailUrl;
      } else {
        return `${this.FPMA_DOMAIN}${thumbnailUrl}`;
      }
    } else {
      return '';
    }
  }

  public getContentUpdated(): Observable<LastVisitTimestamps | null> {
    return this.http.get<RawContentUpdate>(`${this.FPMA_DOMAIN}api/content-updates`)
      .pipe(
        map(res => this.parseContentUpdates(res)),
        );
  }

  private parseContentUpdates(data: RawContentUpdate): LastVisitTimestamps | null {
    if (data) {
      return {
        broadcasts: data.broadcastsLatestTs,
        events: data.eventsLatestTs,
        news: data.stkNewsLatestTs,
        partages: data.partagesLatestTs
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

export type APIResponse<Name extends string, Data> = { [k in Name]: APIResponseInner<Data> };
export type APIResponseInner<T> = { code: number; data: T; };

interface RawPartage {
  created: string;
  fulltext: string;
  introtext: string;
  rawtext: string;
  thumbnails: string;
  title: string;
};

type RawBroadcast = RawPartage;
type RawPresentation = RawPartage;
type RawGenericPost = RawPartage;
interface RawEvent {
  created: string;
  desc: string;
  /** ISO Date yyyy-MM-dd HH:mm:ss */
  enddate: string;
  id: string | null;
  /** URL */
  image: string;
  rawDesc: string;
  /** ISO Date yyyy-MM-dd HH:mm:ss */
  startdate: string;
  tags: string[];
  title: string;
}
interface RawLiveSection {
  category: number;
  description: string;
  isDevModeOnly: boolean;
  /** HEX color */
  themeColor: string;
  /** image URL */
  themeIcon: string;
  title: string;
  type: string;
}

interface RawNews extends RawPartage {
  /** URL of the pdf */
  files: string[];
}

export type RawContentUpdate = Record<'broadcastsLatestTs' | 'eventsLatestTs' | 'stkNewsLatestTs' | 'partagesLatestTs', number>;

