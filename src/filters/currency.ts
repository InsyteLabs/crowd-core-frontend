'use strict';

export function currencyFilter(val: string|number): string{
    if(isNaN(parseFloat(`${val}`))) return '$0.00';

    return `$${ parseFloat(`${val}`).toFixed(2) }`;
}