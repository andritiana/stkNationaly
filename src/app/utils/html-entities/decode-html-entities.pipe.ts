import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { decodeEntities } from '@wordpress/html-entities';

@Pipe({
    name: 'decodeHtmlEntities',
    standalone: true,
})
export class DecodeHtmlEntitiesPipe implements PipeTransform {

    transform(value: string) {
        return decodeEntities(value);
    }

}
