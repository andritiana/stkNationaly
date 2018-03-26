import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'agenda-page',
    templateUrl: 'agenda.html'
})

export class AgendaPage {
  url:string;
  data:any[];
  constructor(public http: Http, public navCtrl: NavController) { 
  }
  ionViewDidLoad(){
    this.loadAgenda();
  }
  loadAgenda(){
    this.http.get('http://localhost:8888/STKNational/website-stk-national/api/events')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data.events.data;
        console.log(data.results);
    
      },err => {
        console.log(err);
      });
  }

  goToPage(page: string): void {
    switch (page) {
      case 'agenda':
        this.navCtrl.push(AgendaPage);
        break;
      default :
        break;
    }
  }
}
