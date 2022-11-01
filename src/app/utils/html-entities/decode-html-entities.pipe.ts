import { Pipe, PipeTransform } from '@angular/core';
import { decodeEntities } from '@wordpress/html-entities'

@Pipe({
    name: 'decodeHtmlEntities'
})
export class DecodeHtmlEntitiesPipe implements PipeTransform {

    transform(value: any) {
        return decodeEntities(value);
    }
    
}