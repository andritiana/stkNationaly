import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { NavigationExtras} from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { LiveSection, LiveSectionEmbeddedContent, LiveSectionPosts } from '../models/live-section.interface';
import type { Verse } from '../models/verse.interface';
import { FpmaApiService } from '../services/fpma-api.service';
import { VerseService } from '../services/verse.service';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})
export class HomeTabPage implements OnInit {

  public verse?: Verse;
  public loading = true;
  public displayLiveSections = false;
  public liveSections: LiveSection[] = [];
  isDevMode$ = this.fpmaApiService.isDevMode$;

  constructor(
    private verseService: VerseService,
    private router: Router,
    private fpmaApiService: FpmaApiService,
    public alertController: AlertController
    ) {
  }

  ngOnInit(): void {
    this.loading = true;

    const verse$ = this.verseService.getVerseOfTheDay().pipe(catchError((e: unknown) => of(null)));
    const liveSections$ = this.fpmaApiService.loadLiveSections().pipe(catchError((e: unknown) => of(null)));
    forkJoin({
      verse: verse$,
      liveSections: liveSections$
    }).subscribe(({ verse, liveSections}) => {
      this.verse = verse || { ref: '1 Corinthiens 11:1', verse: 'Soyez mes imitateurs, comme je le suis moi-même de Christ.' };
      this.liveSections = liveSections || [];
      this.computeDisplayLiveSections();

      this.loading = false;
    });
    this.isDevMode$.subscribe(() => {
      this.computeDisplayLiveSections();
    })
  }

  computeDisplayLiveSections(): void {
    if (!this.isDevMode$.value) {
      this.displayLiveSections = this.liveSections.some(ls => !ls.isDevModeOnly);
    } else {
      this.displayLiveSections = this.liveSections.length > 0;
    }
  }

  goToSection(section: LiveSection): void {
    switch (section.type) {
      // Section of posts by category
      case 'posts':
        const postNavExtras: NavigationExtras = { state: { title: section.title, fetchCategory: (section as LiveSectionPosts).category } };
        this.router.navigate(['/tabs/live-sections-page'], postNavExtras);
        break;

      // Embedded content with url
      case 'embedded':
        const embeddedNavExtras: NavigationExtras = { state: { title: section.title, url: (section as LiveSectionEmbeddedContent).url } };
        this.router.navigate(['/tabs/live-sections-embedded-page'], embeddedNavExtras);
        break;
    }
  }


  getColor(colorHexa: string) {
    if (colorHexa && /^#([0-9A-F]{3}){1,2}$/i.test(colorHexa)) {
      return colorHexa;
    } else {
      return '#19338F';
    }
  }

}
