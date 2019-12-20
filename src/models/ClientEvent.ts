'use strict';

import { IEventQuestion, IEventSettings, IEventMessage } from '@/interfaces';

export class ClientEvent{
    id?: number;

    clientId:    number;
    title:       string;
    slug:        string;
    slugId:      string;
    description: string;
    startTime:   Date;
    endTime:     Date;
    active?:     boolean;
    views?:      number;

    questions: IEventQuestion[];
    messages:  IEventMessage[];
    settings:  IEventSettings;

    constructor(event: any){
        this.id = event.id;
        
        this.clientId    = event.clientId;
        this.title       = event.title;
        this.slug        = event.slug;
        this.slugId      = event.slugId;
        this.description = event.description;
        this.startTime   = new Date(event.startTime);
        this.endTime     = new Date(event.endTime);
        this.active      = event.active;
        this.views       = event.views;

        this.questions = event.questions || [];
        this.messages  = event.messages  || [];
        this.settings  = event.settings  || {};
    }
}