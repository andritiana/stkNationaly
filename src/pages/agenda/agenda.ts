import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AgendaEvent } from "../../models/agenda-event.interface";
import { FpmaApiService } from "../../services/fpma-api/fpma-api.service";

@Component({
    selector: 'agenda-page',
    templateUrl: 'agenda.html'
})

export class AgendaPage {
  url: string;
  events: AgendaEvent[];

  constructor(public fpmaApiService: FpmaApiService, public navCtrl: NavController) { 
  }

  ionViewDidLoad(){
    this.loadAgenda();
  }

  loadAgenda(){
    this.fpmaApiService.loadAgenda().subscribe((events: AgendaEvent[]) => {
        this.events = events;
      },err => {
        console.log(err);
      });
  }

  goToHome() {
    this.navCtrl.parent.select(0);
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
