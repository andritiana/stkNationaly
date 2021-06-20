import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, flatMap, catchError } from 'rxjs/operators';

import { Verse } from '../models/verse.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class VerseService {

    private FPMA_DOMAIN = 'https://stk.fpma.church/';


    constructor(private http: HttpClient) {}

    /**
     * Method that retrieve list of events from the stk.fpma api
     */
    public getVerseOfTheDay(): Observable<Verse> {
        return this.http.get(`${this.FPMA_DOMAIN}api/votd`)
        .pipe(
            map((res: any) => this.parseVerse(res)),
            catchError((e: any) => {
            return Observable.throw(e);
        }));
    }

    private parseVerse(res: any): Verse {
        if (res && res.votd && res.votd.data) {
            const verseData = res.votd.data;
            return {ref: verseData.ref, verse: verseData.verse, mention: verseData.mention};
        } else {
            throw console.error('no verse data');
        }
    }
}
