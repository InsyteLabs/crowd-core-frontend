'use strict';

import { IVueFilter } from '@/interfaces';

import { dateFilter }     from './date';
import { dateTimeFilter } from './date-time';
import { currencyFilter } from './currency';
import { truncateFilter } from './truncate';

export const filters: IVueFilter[] = [
    { name: 'date',     method: dateFilter     },
    { name: 'dateTime', method: dateTimeFilter },
    { name: 'truncate', method: truncateFilter },
    { name: 'currency', method: currencyFilter }
];