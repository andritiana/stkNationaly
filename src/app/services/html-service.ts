import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root',
})
export class HtmlService {

    constructor(private sanitizer: DomSanitizer) { }

    public enableEmbededContent(htmlContent: string): SafeHtml {
        const container = document.createElement('div');
        container.innerHTML = htmlContent;

        const iframes = container.getElementsByTagName('iframe');
        if (iframes.length == 0) {
            return htmlContent;
        }

        // Wrap chaque iframe dans une div pour qu'il soit plus aisé
        // d'ajuster le CSS des iframe
        // https://stackoverflow.com/a/36851248, https://codepen.io/Lauri22/pen/oZqrGa
        [].forEach.call(iframes, iframe => {
            iframe.outerHTML = '<div class="media-container">' + iframe.outerHTML + '</div>';
        });

        return this.sanitizer.bypassSecurityTrustHtml(container.innerHTML);
    }

}