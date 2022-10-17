declare const ngDevMode: unknown;
// Declare manuellement la definition du widget de Soundcloud
// afin que TypeScript ne lance pas d'erreur de type lorsqu'il voit SC.Widget
// https://developers.soundcloud.com/docs/api/html5-widget#api
declare namespace SC {
  function Widget(iframe: HTMLIFrameElement): Widget;
  interface Widget {
    pause(): void;
  }
}
