import { SafeHtml } from "@angular/platform-browser";

export interface ArticleSpi {
  title: string;
  creationDate: Date;
  text: SafeHtml;
  thumbnail: string;
}