'use strict';

import conf                       from '@/conf';
import { IEvent, IEventQuestion } from '@/interfaces';
import { httpService as http }    from '@/services/Http';

const { apiUrl } = conf;

const JSON_HEADERS = {
    'Content-Type': 'application/json'
}

class EventService{
    async getEvents(clientId: number){

        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const events: IEvent[] = await http.get<IEvent[]>({ url });

        events.forEach((e: any) => {
            e.startTime = new Date(e.startTime);
            e.endTime   = new Date(e.endTime);
        });

        return events;
    }

    async getEvent(clientId: number, slug: string): Promise<IEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ slug }`;

        const event: IEvent = await http.get<IEvent>({ url });

        event.startTime = new Date(event.startTime);
        event.endTime   = new Date(event.endTime);

        return event;
    }

    async createEvent(clientId: number, event: IEvent): Promise<IEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const newEvent: IEvent = await http.post<IEvent>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        newEvent.startTime = new Date(newEvent.startTime);
        newEvent.endTime   = new Date(newEvent.endTime);

        return newEvent;
    }

    async updateEvent(clientId: number, event: IEvent): Promise<IEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const updatedEvent: IEvent = await http.put<IEvent>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        updatedEvent.startTime = new Date(updatedEvent.startTime);
        updatedEvent.endTime   = new Date(updatedEvent.endTime);

        return updatedEvent;
    }

    async deleteEvent(clientId: number, event: IEvent): Promise<IEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const deleted: IEvent = await http.delete<IEvent>({ url });

        deleted.startTime = new Date(deleted.startTime);
        deleted.endTime   = new Date(deleted.endTime);

        return deleted;
    }

    async getQeustion(eventId: number, questionId: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ eventId }/questions/${ questionId }`;

        const question: IEventQuestion = await http.get({ url });

        return question;
    }

    async createEventQuestion(question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions`;

        const newQuestion: IEventQuestion = await http.post<IEventQuestion>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(question)
        });
        
        return newQuestion;
    }

    async updateEventQuestion(question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions/${ question.id }`;

        const updatedQuestion: IEventQuestion = await http.put<IEventQuestion>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(question)
        });

        return updatedQuestion;
    }

    async deleteEventQuestion(question: IEventQuestion): Promise<boolean>{
        const url = `${ apiUrl }/events/${ question.eventId }/questions/${ question.id }`;

        const res: any = await http.delete<any>({ url });

        return res.deleted;
    }

    async createQuestionVote(eventId: number, questionId: number, userId: number, value: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ eventId }/questions/${ questionId }/votes`;

        const body = {
            eventId,
            questionId,
            userId,
            value
        }

        const res: any = await http.post<any>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(body)
        });
        
        return this.getQeustion(eventId, questionId);
    }
}

export const eventService = new EventService();