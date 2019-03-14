import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AgendaEvent } from "../../models/agenda-event.interface";
import { FpmaApiService } from "../../services/fpma-api/fpma-api.service";
import { DateHelper } from "../../services/utils/date-helper";

@Component({
    selector: 'agenda-page',
    templateUrl: 'agenda.html'
})

export class AgendaPage {
  public url: string;
  public events: AgendaEvent[];
  public DateHelper = DateHelper;
  public loading = true;

  constructor(public fpmaApiService: FpmaApiService, public navCtrl: NavController) { 
  }

  ionViewDidLoad(){
    this.loadAgenda();
  }

  loadAgenda(){
    this.loading = true;
    this.fpmaApiService.loadAgenda().subscribe((events: AgendaEvent[]) => {
        this.events = events;
        this.loading = false;
      },err => {
        this.loading = false;
        console.log(err);
      });
  }

  isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

  public refresh() {
    this.loadAgenda();
  }
}
