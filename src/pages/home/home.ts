import { Component, OnInit } from '@angular/core';
import { VerseService } from '../../services/verse/verse.service';
import { Verse } from '../../models/verse.interface';
import { AgendaPage } from '../agenda/agenda';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  verse: Verse;

  constructor(
    private verseService: VerseService, 
    private navController: NavController) {
  }
    
  ngOnInit(): void {
    this.verseService.getVerseOfTheDay().subscribe((verse: Verse) => {
      this.verse = verse;
    });
  }
  goToPage(page: string): void {
    switch (page) {
      case 'agenda':
        this.navController.push(AgendaPage);
        break;
      default :
        break;
    }
  }
}
