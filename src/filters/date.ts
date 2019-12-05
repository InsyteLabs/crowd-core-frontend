'use strict';

export function dateFilter(date: Date|string): string{
    if(!date) return '';

    const d = new Date(date);

    if(d.toString() === 'Invalid Date') return '';

    let year  = (d.getFullYear()).toString(),
        month = (d.getMonth() + 1).toString(),
        day   = (d.getDate()).toString();
    
    month = month.padStart(2, '0');
    day   = day.padStart(2, '0');

    return `${ month }/${ day }/${ year }`;
}