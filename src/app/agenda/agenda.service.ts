import { Injectable, inject } from '@angular/core';
import type { APIResponse} from '../services/fpma-api.service';
import { FpmaApiService } from '../services/fpma-api.service';
import type { Observable} from 'rxjs';
import { map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { createCacheByKey } from '../utils/cache/cache';

@Injectable({ providedIn: 'root' })
export class AgendaService {

  readonly agendaCache = createCacheByKey<string, AgendaEvent[]>({ expiry: { minutes: 10 } });
  private fpmaApiService = inject(FpmaApiService);
  private http = inject(HttpClient);



  /**
   * Method that retrieve list of events from the stk.fpma api
   */
  public loadAgenda(): Observable<AgendaEvent[]> {
    const httpOptions = this.fpmaApiService.isDevMode
      ? {
          headers: new HttpHeaders({
            'dev-mode': '',
          }),
        }
      : {};

    return this.http.get<APIResponse<'events', RawEvent[]>>(`${this.fpmaApiService.FPMA_DOMAIN}api/events`, httpOptions).pipe(
      map((res) => {
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
      })
    );
  }

  public loadAgendaById(id: number): Observable<AgendaEvent | null> {
    return this.http.get<APIResponse<'events', RawEvent>>(`${this.fpmaApiService.FPMA_DOMAIN}api/events/${id}`).pipe(
      map((res) => {
        if (res?.events?.data) {
          return this.parseEvent(res.events.data);
        }
        return null;
      })
    );
  }

  public loadMonthsEventsAgenda(month: number, year: number): Observable<AgendaEvent[]> {
    const httpOptions = this.fpmaApiService.isDevMode
      ? {
          headers: new HttpHeaders({
            'dev-mode': '',
          }),
        }
      : {};
    return this.http
      .get<APIResponse<'events', RawEvent[]>>(`${this.fpmaApiService.FPMA_DOMAIN}api/events/${year}/${month}`, httpOptions)
      .pipe(
        map((res) => {
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
        this.agendaCache.doCacheByKey([month, year].join('-')),
      );
  }



  private parseEvent(elem: RawEvent): AgendaEvent {
    return {
      id: -1,
      title: elem.title,
      startTime: DateHelper.getDate(elem.startdate),
      endTime: elem.enddate ? DateHelper.getDate(elem.enddate) : DateHelper.getDate(elem.startdate),
      text: elem.desc,
      thumbnail: this.fpmaApiService.parseThumbnailUrl(elem.image),
      allDay: false,
    };
  }

}

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
