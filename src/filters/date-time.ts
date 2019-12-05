'use strict';

import { dateFilter } from './date';

export function dateTimeFilter(date: Date|string): string{
    if(!date) return '';

    const d = new Date(date);

    if(d.toString() === 'Invalid Date') return '';

    const dateString = dateFilter(d);

    let hour = d.getHours().toString(),
        min  = d.getMinutes().toString(),
        sec  = d.getSeconds().toString();

    hour = hour.padStart(2, '0');
    min  = min.padStart(2, '0');
    sec  = sec.padStart(2, '0');

    return `${ dateString } ${ hour }:${ min }:${ sec }`;
}