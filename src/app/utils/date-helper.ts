import * as moment from 'moment';

export class DateHelper {

  static getDay(date: Date) {
    return moment(date).format('DD');
  }

  static getWeekDay(date: Date) {
    return moment(date).format('ddd');
  }

  static getMonth(date: Date) {
    return moment(date).format('MMM');
  }

  static getDateFormat(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  static getDateWrittenFr(date: Date): string {
    return moment(date).locale('fr').format('DD MMMM YYYY');
  }

  static getHours(date: Date) {
    return moment(date).format('HH:mm');
  }

  static getDate(str: string): Date {
    return moment(str).toDate();
  }
}
