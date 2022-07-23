declare const ngDevMode: unknown;
declare const SC: SC;

// Declare manuellement la definition du widget de Soundcloud
// afin que TypeScript ne lance pas d'erreur de type lorsqu'il voit SC.Widget
interface SC {
    Widget: any
}
