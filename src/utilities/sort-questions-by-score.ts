'use strict';

import { IEventQuestion } from '@/interfaces';

export function sortQuestionsByScore(a: IEventQuestion, b: IEventQuestion): number{
    if(!(a.stats && b.stats))           return 0;
    if(a.stats.score === b.stats.score) return 0;
    
    return a.stats.score > b.stats.score ? -1 : 1;

}