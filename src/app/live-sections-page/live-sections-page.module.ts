import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { GlobalHeaderModule } from "../global-header/global-header.module";
import { LiveSectionDetailsPagePage } from "./live-section-details-page/live-section-details-page.page";
import { LiveSectionsPagePageRoutingModule } from "./live-sections-page-routing.module";
import { LiveSectionsPagePage } from "./live-sections-page.page";
import { ArticleEmbeddingIframeComponentModule } from "../articles/article-embedding-iframe/article-embedding-iframe.module";
import { DecodeHtmlEntitiesPipe } from "../utils/html-entities/decode-html-entities.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveSectionsPagePageRoutingModule,
    GlobalHeaderModule,
    ArticleEmbeddingIframeComponentModule,
    DecodeHtmlEntitiesPipe,
  ],
  declarations: [LiveSectionsPagePage, LiveSectionDetailsPagePage],
})
export class LiveSectionsPagePageModule {}
