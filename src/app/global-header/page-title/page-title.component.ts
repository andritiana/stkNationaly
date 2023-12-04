import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mystk-page-title',
  template: `<h1 class="page-title">
    <ng-content></ng-content>
  </h1>
  <ng-content select="ion-button"></ng-content>`,
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
