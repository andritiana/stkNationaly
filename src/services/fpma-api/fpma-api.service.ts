import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AgendaEvent } from "../../models/agenda-event.interface";
import { DateHelper } from "../utils/date-helper.service";

@Injectable()
export class FpmaApiService {
  
  constructor(
    public http: HttpClient
  ) { 
  }

  loadAgenda(): Observable<AgendaEvent[]> {
    return this.http.get('http://stk.fpma.net/api/events')
      .map((res: any) => this.parseEvent(res))
  }

  parseEvent(elem: any): AgendaEvent[] {
    const events: AgendaEvent[] = [];
    if (elem && elem.events && elem.events.data && elem.events.data.length > 0) {
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
}