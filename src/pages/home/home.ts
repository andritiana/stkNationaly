import { Component, OnInit } from '@angular/core';
import { VerseService } from '../../services/verse/verse.service';
import { Verse } from '../../models/verse.interface';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public verse: Verse;
  public loading = true;

  constructor(
    private verseService: VerseService,
    private navController: NavController) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.verseService.getVerseOfTheDay().subscribe((verse: Verse) => {
      this.verse = verse;
      this.loading = false;
    }, () => {
      this.verse = { bookName: '1 Corinthiens', chapter: 11, verse: 1, text: 'Soyez mes imitateurs, comme je le suis moi-même de Christ.' }
      this.loading = false;
    });
  }
  goToPage(page: string): void {
    if (page === 'partage') {
      this.navController.parent.select(3);
    } else if (page === 'presentation') {
      this.navController.parent.select(2);
    } else if (page === 'actus') {
      this.navController.parent.select(1);
    }
  }
}
