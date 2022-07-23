import { Component, ElementRef, ViewChild } from '@angular/core';
import { Actualities } from 'src/app/models/actuality.interface';
import { DateHelper } from 'src/app/utils/date-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/services/player-service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-actuality-details',
  templateUrl: 'actuality-details.page.html',
  styleUrls: ['actuality-details.page.scss']
})
export class ActualityDetailsPage {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public actualities: Actualities[];
  public DateHelper = DateHelper;
  public actualityId: number;
  public loading = true;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private elem: ElementRef
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.actualities = this.router.getCurrentNavigation().extras.state.actualities;
        this.actualityId = this.router.getCurrentNavigation().extras.state.id;
        this.slideOpts.initialSlide = this.actualityId;
      }
    });
  }

  async ionSlideDidChange() {
    const previousSlideIndex = await this.slides.getPreviousIndex();

    const embeddedIframes: NodeList = this.elem.nativeElement.querySelectorAll(`.article-pos-${previousSlideIndex} .media-container iframe`);

    this.playerService.pauseIframePlayers(embeddedIframes);
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
