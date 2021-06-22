import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveSectionsPagePageRoutingModule } from './live-sections-page-routing.module';

import { LiveSectionsPagePage } from './live-sections-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveSectionsPagePageRoutingModule
  ],
  declarations: [LiveSectionsPagePage]
})
export class LiveSectionsPagePageModule {}
