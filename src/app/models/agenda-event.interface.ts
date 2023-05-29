import type { IEvent } from "ionic2-calendar/calendar";

export interface AgendaEvent extends IEvent {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  text: string;
  thumbnail: string;
}
