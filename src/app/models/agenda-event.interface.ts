import type { IEvent } from "ionic2-calendar/calendar";

export interface AgendaEvent extends IEvent {
  /** almost never present */
  id?: number;
  title: string;
  startTime: Date;
  endTime: Date;
  text: string;
  thumbnail: string;
}
