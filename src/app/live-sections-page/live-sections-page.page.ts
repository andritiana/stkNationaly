import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GenericPost } from '../models/generic-post.interface';
import { FpmaApiService } from '../services/fpma-api.service';

@Component({
  selector: 'app-live-sections-page',
  templateUrl: './live-sections-page.page.html',
  styleUrls: ['./live-sections-page.page.scss'],
})
export class LiveSectionsPagePage {

  public title: string;
  public fetchCategory: number;
  public posts: GenericPost[];
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private fpmaApiService: FpmaApiService,
    private router: Router) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.fetchCategory = this.router.getCurrentNavigation().extras.state.fetchCategory;

        this.loadSectionPosts(this.fetchCategory);
      }
    });
  }

  private loadSectionPosts(fetchCategory: number) {
    this.loading = true;
    this.fpmaApiService.loadGenericPosts(fetchCategory).subscribe((posts: GenericPost[]) => {
      this.posts = posts;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  public goToDetails(index: number) {
    const navigationExtras: NavigationExtras = { state: { sectionTitle: this.title, posts: this.posts, id: index } };
    this.router.navigate(['/tabs/live-sections-page/details'], navigationExtras);
  }

  public refresh() {
    this.loadSectionPosts(this.fetchCategory);
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
