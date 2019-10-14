'use strict';

import conf       from '@/conf';
import { IEvent, IEventQuestion } from '@/interfaces';

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

    async getQeustion(eventId: number, questionId: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ eventId }/questions/${ questionId }`;

        let res: Response = await fetch(url);

        const question: IEventQuestion = await res.json();

        return question;
    }

    async createEventQuestion(question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions`;

        let res: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });

        const newQuestion: IEventQuestion = await res.json();

        return newQuestion;
    }

    async updateEventQuestion(question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions/${ question.id }`;

        let res: Response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });

        const updatedQuestion: IEventQuestion = await res.json();

        return updatedQuestion;
    }

    async deleteEventQuestion(question: IEventQuestion): Promise<boolean>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions/${ question.id }`;

        let res: Response = await fetch(url, {
            method: 'DELETE'
        });

        const { deleted } = await res.json();

        return deleted
    }

    async createQuestionVote(eventId: number, questionId: number, userId: number, value: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ eventId }/questions/${ questionId }/votes`;

        const body = {
            eventId,
            questionId,
            userId,
            value
        }

        let res: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        return this.getQeustion(eventId, questionId);
    }
}

export const eventService = new EventService();