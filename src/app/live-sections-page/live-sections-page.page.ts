import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FpmaApiService } from '../services/fpma-api.service';

@Component({
  selector: 'app-live-sections-page',
  templateUrl: './live-sections-page.page.html',
  styleUrls: ['./live-sections-page.page.scss'],
})
export class LiveSectionsPagePage {

  constructor(
    public navCtrl: NavController,
    private fpmaApiService: FpmaApiService,
    private router: Router) { 
      this.loadSectionPosts();
    }

  loadSectionPosts() {
    console.log('Load section posts');
  }

  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

}
