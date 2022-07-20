import { SafeHtml } from "@angular/platform-browser";

export interface Actualities{
    title: string;
    text: SafeHtml;
    rawtext: string;
    created: Date;
    thumbnail: string;
}
