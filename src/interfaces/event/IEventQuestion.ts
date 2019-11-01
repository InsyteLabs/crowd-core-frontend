'use strict';

import { IEventQuestionStats } from './IEventQuestionStats'

export interface IEventQuestion{
    id?:     number;
    eventId: number;
    userId:  number;
    text:    string;
    hidden:  boolean;
    stats?:  IEventQuestionStats
}