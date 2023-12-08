import type {
  SimpleChanges} from '@angular/core';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation,
  inject
} from '@angular/core';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import '../../../assets/js/soundcloud-api.js';
import { MystkViewerjsDirective } from '../mystk-viewerjs/mystk-viewerjs.directive';


@Component({
  selector: "mystk-article-embedding-iframe",
  template: ``,
  host: {
    '(click)': 'onClick($event)',
  },
  providers: [MystkViewerjsDirective], // TODO replace with hostDirectives
  styleUrls: ["./article-embedding-iframe.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleEmbeddingIframeComponent {
  @Input()
  article?: string;
  @HostBinding('class.article-is-visible')
  _isVisible = false;

  @Input()
  set isVisible(v: BooleanInput) {
    this._isVisible = coerceBooleanProperty(v)
  };
  get isVisible(): boolean {
    return this._isVisible;
  }
  @HostBinding('innerHTML')
  processedArticle?: SafeHtml;


  private images: HTMLImageElement[] = [];
  private viewer = inject(MystkViewerjsDirective, {self: true});

  constructor(
    private domSanitizer: DomSanitizer,
    private eltRef: ElementRef<HTMLElement>,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.article) {
      const container = new DOMParser().parseFromString(
        this.article ?? '<div></div>',
        "text/html"
      );
      const iframes = container.getElementsByTagName("iframe");
      this.images = Array.from(container.body.querySelectorAll('img'));

      this.enableYouTubeAPI(iframes);

      this.processedArticle = this.domSanitizer.bypassSecurityTrustHtml(
        container.body.innerHTML
      );
    }
    if (changes.isVisible) {
      const {currentValue, previousValue} = changes.isVisible;
      if (previousValue !== currentValue && currentValue === false) {
        this.pauseIframePlayers();
      }
    }
  }

  ngAfterViewInit() {
    this.viewer.ngAfterViewInit();
  }

  /** Ajouter le paramètre 'enablejsapi' dans l'iframe
   * pour pouvoir mettre en pause/stop les vidéos: https://stackoverflow.com/a/30358006
   **/
  private enableYouTubeAPI(iframes: HTMLCollectionOf<HTMLIFrameElement>) {
    Array.from(iframes).forEach((iframe) => {
      // Youtube
      const mediaUrl = new URL(iframe.src);
      if (/youtube.com/.test(mediaUrl.hostname)) {
        mediaUrl.searchParams.set("enablejsapi", "1");
        iframe.src = mediaUrl.href;
      }
    });
  }

  private onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      const imgIndex = this.images.indexOf(img);
      this.viewer.show(imgIndex);
    }
  }

  private pauseIframePlayers(): void {
    const iframes = this.eltRef.nativeElement.querySelectorAll('iframe');
    if (!iframes || iframes.length < 1) {
      return;
    }

    iframes.forEach((iframe: HTMLIFrameElement) => {
      const mediaUrl = new URL(iframe.getAttribute("src") ?? '');

      if (/youtube.com/.test(mediaUrl.hostname)) {
        // Fonctionne lorsque l'url de la video contient le parametre 'enablejsapi' à 1
        iframe.contentWindow?.postMessage(
          `{"event":"command","func":"pauseVideo","args":""}`,
          "*"
        );
      } else if (/soundcloud.com/.test(mediaUrl.hostname)) {
        const scWidget = SC.Widget(iframe);
        scWidget.pause();
      }
    });
  }
}
