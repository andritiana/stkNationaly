import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPost } from 'src/app/models/generic-post.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-live-section-details-page',
  templateUrl: './live-section-details-page.page.html',
  styleUrls: ['./live-section-details-page.page.scss'],
})
export class LiveSectionDetailsPagePage {

  public sectionTitle: string = '';
  public posts: GenericPost[] = [];
  public DateHelper = DateHelper;
  public postId?: number;
  public loading = true;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        const navState = this.router.getCurrentNavigation()!.extras.state!;
        this.sectionTitle = navState.sectionTitle;
        this.posts = navState.posts;
        this.postId = navState.id;
        this.slideOpts.initialSlide = this.postId ?? this.slideOpts.initialSlide;
      }
    });
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
