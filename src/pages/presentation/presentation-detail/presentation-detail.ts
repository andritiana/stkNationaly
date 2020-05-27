import { Component, OnInit } from "@angular/core";
import { NavParams } from 'ionic-angular';
import { Presentation } from "../../../models/presentation.interface";
import { FpmaApiService } from "../../../services/fpma-api/fpma-api.service";
import { DomSanitizer } from "@angular/platform-browser";



@Component({
  selector: 'presentation-detail-page',
  templateUrl: 'presentation-detail.html'
})

export class PresentationDetailPage implements OnInit {

  public presentation: Presentation;
  public loading = true;
  public presentationId: number;


  constructor(
    private navParams: NavParams,
    private fpmaApiService: FpmaApiService,
    private sanitized: DomSanitizer
  ){}

  ngOnInit(): void {
    this.presentationId = Number(this.navParams.get('id'));
  }

  ionViewDidLoad(){
    this.loadPresentation();
  }

  loadPresentation(){
    this.loading = true;
    this.fpmaApiService.loadPresentation(this.presentationId).subscribe((presentations: Presentation | null) => {
      this.presentation = presentations;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  public removeHtmlLink(textHtml: string) {
    let htmlWithoutLink = textHtml.replace(/href/g,'alt');
    htmlWithoutLink = this.sanitized.bypassSecurityTrustHtml(htmlWithoutLink) as string;
    return htmlWithoutLink;
  }
}
