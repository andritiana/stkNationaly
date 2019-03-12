import { Component, OnInit } from "@angular/core";
import { ArticleSpi } from "../../../models/article-spi.interface";
import { NavParams } from 'ionic-angular';
import { DateHelper } from '../../../services/utils/date-helper';



@Component({
  selector: 'spi-detail-page',
  templateUrl: 'spi-detail.html'
})

export class SpiDetailPage implements OnInit {

  public partages: ArticleSpi[];
  public articleIndex: number;
  public DateHelper = DateHelper;


  constructor(
    private navParams: NavParams
  ){}

  ngOnInit(): void {
    this.partages = this.navParams.get('articles');
    this.articleIndex = this.navParams.get('index');
  }
}
