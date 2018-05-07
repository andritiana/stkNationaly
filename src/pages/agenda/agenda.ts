import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AgendaEvent } from "../../models/agenda-event.interface";
import { FpmaApiService } from "../../services/fpma-api/fpma-api.service";
import { DateHelper } from "../../services/utils/date-helper.service";

@Component({
    selector: 'agenda-page',
    templateUrl: 'agenda.html'
})

export class AgendaPage {
  url: string;
  events: AgendaEvent[];
  DateHelper = DateHelper;

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
}
