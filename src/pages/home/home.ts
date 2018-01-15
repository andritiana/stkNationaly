import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VerseService } from '../../services/verse/verse.service';
import { Verse } from '../../models/verse.interface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  verse: Verse;

  constructor(public navCtrl: NavController, private verseService: VerseService) {
  }
    
  ngOnInit(): void {
    this.verseService.getVerseOfTheDay().subscribe((verse: Verse) => {
      this.verse = verse;
    });
  }

}
