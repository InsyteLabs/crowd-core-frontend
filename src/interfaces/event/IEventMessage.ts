'use strict';

export interface IEventMessage{
    id?:     number;
    
    eventId: number;
    userId:  number;
    text:    string;
    hidden:  boolean;

    user?: {
        id: number;

        firstName:   string;
        lastName:    string;
        username:    string;
        isAnonymous: boolean;
    }
}