import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  
  @ViewChild('homeContent', { read: ElementRef }) 
  private homeElem: ElementRef
  
  constructor(public navCtrl: NavController) {
  }
  
  ngAfterViewInit(): void {
    this.homeElem.nativeElement.style.background = 'url("https://source.unsplash.com/collection/1045802")';
    this.homeElem.nativeElement.style.backgroundSize = 'cover';
  }
}
