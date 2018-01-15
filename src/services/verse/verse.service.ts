import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Verse } from "../../models/verse.interface";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class VerseService {

    constructor(private http: HttpClient) {}

    public getVerseOfTheDay(): Observable<Verse> {
        return this.http.jsonp('http://labs.bible.org/api/?passage=votd&type=json', 'callback')
            .map((response: Response) => this.parseVerseParam(response[0]));
    }

    private parseVerseParam(data: any): Verse {
        return {bookName: data.bookname, chapter: data.chapter, verse: data.verse};
    }
}