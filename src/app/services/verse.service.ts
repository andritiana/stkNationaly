import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, flatMap, catchError } from 'rxjs/operators';

import { Verse } from '../models/verse.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class VerseService {

    constructor(private http: HttpClient) {}

    public getVerseOfTheDay(): Observable<Verse> {
        return this.http.jsonp('http://labs.bible.org/api/?passage=votd&type=json', 'callback').pipe(
        map((response: Response) => this.parseVerseParam(response[0])),
        flatMap((res: Verse) => {
            return this.http.jsonp(`http://getbible.net/json?p=${res.bookName}${res.chapter}:${res.verse}&v=ostervald`, 'callback')
            .pipe(
                map(result => {
                return {bookName: res.bookName, chapter: res.chapter, verse: res.verse, text: this.getVerseText(result, res.verse)};
             }),
             catchError((e: any) => {
                 return Observable.throw(this.handleError(e));
             }));
        })
        );
    }

    private parseVerseParam(data: any): Verse {
        return {bookName: data.bookname, chapter: +data.chapter, verse: +data.verse};
    }

    private getVerseText(data: any, verseNumber: number): string {
        let verseText = '';
        if (data && data.book[0] && data.book[0].chapter[verseNumber]) {
            verseText = data.book[0].chapter[verseNumber].verse;
            verseText = verseText.slice(0, -3);
        }
        return verseText;
    }

    private handleError(error: any) {
        console.log(error);
    }
}
