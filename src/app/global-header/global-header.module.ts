import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalHeaderComponent } from './global-header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from './page-title/page-title.component';



@NgModule({
  declarations: [GlobalHeaderComponent, PageTitleComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [GlobalHeaderComponent, PageTitleComponent],
})
export class GlobalHeaderModule { }
