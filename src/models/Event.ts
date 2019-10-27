'use strict';

import { IEventQuestion, IEventSettings } from '@/interfaces';

export class Event{
    id?: number;

    clientId:    number;
    title:       string;
    slug:        string;
    description: string;
    startTime:   Date;
    endTime:     Date;
    active?:     boolean;

    questions: IEventQuestion[];
    settings:  IEventSettings;

    constructor(event: any){
        this.id = event.id;
        
        this.clientId    = event.clientId;
        this.title       = event.title;
        this.slug        = event.slug;
        this.description = event.description;
        this.startTime   = new Date(event.startTime);
        this.endTime     = new Date(event.endTime);
        this.active      = event.active;

        this.questions = event.questions || [];
        this.settings = event.settings   || {};
    }
}