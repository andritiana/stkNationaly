import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Verse } from '../../models/verse.interface';

@Injectable()
export class VerseService {

    constructor(private http: HttpClient) {}

    public getVerseOfTheDay(): Observable<Verse> {
        return this.http.jsonp('http://labs.bible.org/api/?passage=votd&type=json', 'callback')
        .map((response: Response) => this.parseVerseParam(response[0]))
        .flatMap((res: Verse) => {
            return this.http.jsonp(`http://getbible.net/json?p=${res.bookName}${res.chapter}:${res.verse}&v=ostervald`, 'callback')
            .map(result => {
               return {bookName: res.bookName, chapter: res.chapter, verse: res.verse, text: this.getVerseText(result, res.verse)}
            })
            .catch((e: any) => {
                return Observable.throw(this.handleError(e));
            })
        })  
    }

    private parseVerseParam(data: any): Verse {
        return {bookName: data.bookname, chapter: +data.chapter, verse: +data.verse};
    }

    private getVerseText(data: any, verseNumber: number): string {
        let verseText: string = '';
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