'use strict';

import conf       from '@/conf';
import { IEvent } from '@/interfaces';

const { apiUrl } = conf;

class EventService{
    async getEvents(clientId: number){
        let events: any = await fetch(`${ apiUrl }/clients/${ clientId }/events`);
            events      = await events.json();

        events.forEach((e: any) => {
            e.startTime = new Date(e.startTime);
            e.endTime   = new Date(e.endTime);
        });

        return events;
    }
}

export const eventService = new EventService();