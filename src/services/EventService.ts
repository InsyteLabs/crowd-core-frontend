'use strict';

import conf                    from '@/conf';
import { Event }               from '@/models';
import { IEventQuestion }      from '@/interfaces';
import { httpService as http } from '@/services/Http';

const { apiUrl } = conf;

const JSON_HEADERS = {
    'Content-Type': 'application/json'
}

class EventService{
    async getEvents(clientId: number): Promise<Event[]>{

        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const events: Event[] = await http.get<Event[]>({ url });

        return events.map(e => new Event(e));
    }

    async getEvent(clientId: number, slug: string): Promise<Event>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ slug }`;

        const event: Event = await http.get<Event>({ url });

        return new Event(event);
    }

    async createEvent(clientId: number, event: Event): Promise<Event>{
        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const newEvent: Event = await http.post<Event>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        return new Event(newEvent);
    }

    async updateEvent(clientId: number, event: Event): Promise<Event>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const updatedEvent: Event = await http.put<Event>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        return new Event(updatedEvent);
    }

    async deleteEvent(clientId: number, event: Event): Promise<Event>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const deletedEvent: Event = await http.delete<Event>({ url });

        return new Event(deletedEvent);
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