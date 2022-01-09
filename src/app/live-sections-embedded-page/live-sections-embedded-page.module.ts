import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveSectionsEmbeddedPagePageRoutingModule } from './live-sections-embedded-page-routing.module';

import { LiveSectionsEmbeddedPagePage } from './live-sections-embedded-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveSectionsEmbeddedPagePageRoutingModule
  ],
  declarations: [LiveSectionsEmbeddedPagePage]
})
export class LiveSectionsEmbeddedPagePageModule {}
