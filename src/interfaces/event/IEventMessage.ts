'use strict';

import { ISparseUser } from '../ISparseUser';

export interface IEventMessage{
    id?:     number;
    eventId: number;
    text:    string;
    hidden:  boolean;
    
    userId: number;
    user?:  ISparseUser;
}