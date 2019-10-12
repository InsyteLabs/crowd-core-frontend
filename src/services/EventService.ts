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

    async getEvent(clientId: number, slug: string): Promise<IEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ slug }`;

        let event: any = await fetch(url);
            event      = await event.json();

        event.startTime = new Date(event.startTime);
        event.endTime   = new Date(event.endTime);

        return event;
    }

    async createEvent(event: IEvent): Promise<IEvent>{
        const url = `${ apiUrl }/events`;

        let res: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        const newEvent: IEvent = await res.json();

        newEvent.startTime = new Date(newEvent.startTime);
        newEvent.endTime   = new Date(newEvent.endTime);

        return newEvent;
    }

    async updateEvent(event: IEvent): Promise<IEvent>{
        const url = `${ apiUrl }/events/${ event.id }`;

        let res: Response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        const updatedEvent: IEvent = await res.json();

        updatedEvent.startTime = new Date(updatedEvent.startTime);
        updatedEvent.endTime   = new Date(updatedEvent.endTime);

        return updatedEvent;
    }

    async deleteEvent(event: IEvent): Promise<any>{
        const url = `${ apiUrl }/events/${ event.id }`;

        let res: Response = await fetch(url, {
            method: 'DELETE'
        });

        const deleted = await res.json();

        console.log('Event deleted');
        console.log(deleted);

        return deleted;
    }
}

export const eventService = new EventService();