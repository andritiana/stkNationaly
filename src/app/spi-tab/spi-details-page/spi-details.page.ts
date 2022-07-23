import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { ArticleSpi } from 'src/app/models/article-spi.interface';
import { PlayerService } from 'src/app/services/player-service';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-spi-details',
  templateUrl: 'spi-details.page.html',
  styleUrls: ['spi-details.page.scss']
})
export class SpiDetailsPage {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public partages: ArticleSpi[];
  public articleIndex: number;
  public DateHelper = DateHelper;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actRoute: ActivatedRoute,
    private playerService: PlayerService,
    private elem: ElementRef
  ) {
    this.route.queryParams.subscribe(params => {
        this.articleIndex = this.actRoute.snapshot.params.id;
        if (this.router.getCurrentNavigation().extras.state) {
          this.partages = this.router.getCurrentNavigation().extras.state.articles;
          this.slideOpts.initialSlide = this.articleIndex;
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
