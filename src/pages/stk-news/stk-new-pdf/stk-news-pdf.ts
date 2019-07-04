import { Component, OnInit } from "@angular/core";
import { NavParams } from 'ionic-angular';


@Component({
  selector: 'stk-news-pdf-page',
  templateUrl: 'stk-news-pdf.html'
})

export class StkNewsPdfPage implements OnInit {

  public pdf: string;
  public pdfTitle: string;

  constructor(
    private navParams: NavParams
  ){}

  ngOnInit(): void {
    this.pdf = this.navParams.get('pdfUrl');
    this.pdfTitle = this.navParams.get('title');
  }
}
