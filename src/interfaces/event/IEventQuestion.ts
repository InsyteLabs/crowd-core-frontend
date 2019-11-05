'use strict';

import { IEventQuestionStats } from './IEventQuestionStats'
import { ISparseUser }         from '../ISparseUser';

export interface IEventQuestion{
    id?:     number;
    eventId: number;
    text:    string;
    hidden:  boolean;
    stats?:  IEventQuestionStats

    userId: number;
    user?:  ISparseUser;
}