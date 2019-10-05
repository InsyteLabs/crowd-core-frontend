'use strict';

export function truncateFilter(str: string, len: number): string{
    if(!str || str.length <= len) return str;

    return str.slice(0, len) + '...';
}