import { Component, OnInit } from '@angular/core';
import { Verse } from '../models/verse.interface';
import { VerseService } from '../services/verse.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})
export class HomeTabPage implements OnInit {

  public verse: Verse;
  public loading = true;

  constructor(
    private verseService: VerseService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.verseService.getVerseOfTheDay().subscribe((verse: Verse) => {
      this.verse = verse;
      this.loading = false;
    }, () => {
      this.verse = { ref: '1 Corinthiens 11:1', verse: 'Soyez mes imitateurs, comme je le suis moi-même de Christ.' };
      this.loading = false;
    });
  }

  goToPage(page: string): void {
    if (page === 'partage') {
      this.router.navigate(['/tabs/spi-tab']);
    } else if (page === 'stk') {
      this.router.navigate(['/tabs/presentation-tab/' + 27]);
    } else if (page === 'hymne') {
      this.router.navigate(['/tabs/presentation-tab/' + 149]);
    } else if (page === 'actus') {
      this.router.navigate(['/tabs/actualities-tab']);
    }
  }

}
