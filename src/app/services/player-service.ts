import { ElementRef, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import '../../assets/js/soundcloud-api.js';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {

    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    /**
     * Indique le HTML passé en paramètre, au format string, comme étant safe pour Angular afin d'autoriser les iframe
     * pour charger les players de Youtube et de Soundcloud.
     * 
     * @param htmlContent contenu HTML au format string.
     * @returns du HTML consideré comme safe pour qu'il ne soit pas supprimé par Angular
     */
    public enablePlayableEmbededContent(htmlContent: string): SafeHtml {
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

            const mediaUrl = new URL(iframe.getAttribute('src'));

            // Youtube
            // Pour pouvoir mettre en pause/stop les videos, il faut rajouter le parametre 'enablejsapi'
            // dans l'iframe : https://stackoverflow.com/a/30358006
            if (/youtube.com/.test(mediaUrl.hostname)) {
                if (!mediaUrl.searchParams.has('enablejsapi')) {
                    mediaUrl.searchParams.set('enablejsapi', '1');
                    iframe.setAttribute('src', mediaUrl.href);
                }
            }

            iframe.outerHTML = '<div class="media-container">' + iframe.outerHTML + '</div>';
        });

        return this.sanitizer.bypassSecurityTrustHtml(container.innerHTML);
    }

    public pauseIframePlayers(iframes: NodeList): void {
        if (!iframes || iframes.length < 1) {
            return;
        }

        iframes.forEach((iframe: any) => {
            const mediaUrl = new URL(iframe.getAttribute('src'));

            if (/youtube.com/.test(mediaUrl.hostname)) {
                // Fonctionne lorsque l'url de la video contient le parametre 'enablejsapi' à 1
                iframe.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            } else if (/soundcloud.com/.test(mediaUrl.hostname)) {
                const scWidget = SC.Widget(iframe);
                scWidget.pause();
            }
        });
    }

}