'use strict';

import conf                    from '@/conf';
import { ClientEvent }         from '@/models';
import { IEventQuestion }      from '@/interfaces';
import { httpService as http } from '@/services/Http';

const { apiUrl } = conf;

const JSON_HEADERS = {
    'Content-Type': 'application/json'
}

class EventService{
    async getEvents(clientId: number): Promise<ClientEvent[]>{

        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const events: ClientEvent[] = await http.get<ClientEvent[]>({ url });

        return events.map(e => new ClientEvent(e));
    }

    async getEvent(clientId: number, slug: string): Promise<ClientEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ slug }`;

        const event: ClientEvent = await http.get<ClientEvent>({ url });

        return new ClientEvent(event);
    }

    async createEvent(clientId: number, event: ClientEvent): Promise<ClientEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events`;

        const newEvent: ClientEvent = await http.post<ClientEvent>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        return new ClientEvent(newEvent);
    }

    async updateEvent(clientId: number, event: ClientEvent): Promise<ClientEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const updatedEvent: ClientEvent = await http.put<ClientEvent>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(event)
        });

        return new ClientEvent(updatedEvent);
    }

    async deleteEvent(clientId: number, event: ClientEvent): Promise<ClientEvent>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ event.id }`;

        const deletedEvent: ClientEvent = await http.delete<ClientEvent>({ url });

        return new ClientEvent(deletedEvent);
    }

    async getQeustion(eventId: number, questionId: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/events/${ eventId }/questions/${ questionId }`;

        const question: IEventQuestion = await http.get({ url });

        return question;
    }

    async createEventQuestion(clientId: number, question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ question.eventId }/questions`;

        const newQuestion: IEventQuestion = await http.post<IEventQuestion>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(question)
        });
        
        return newQuestion;
    }

    async updateEventQuestion(clientId: number, question: IEventQuestion): Promise<IEventQuestion>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ question.eventId }/questions/${ question.id }`;

        const updatedQuestion: IEventQuestion = await http.put<IEventQuestion>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(question)
        });

        return updatedQuestion;
    }

    async deleteEventQuestion(clientId: number, question: IEventQuestion): Promise<boolean>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ question.eventId }/questions/${ question.id }`;

        const res: any = await http.delete<any>({ url });

        return res.deleted;
    }

    async createQuestionVote(clientId: number, eventId: number, questionId: number, userId: number, value: number): Promise<IEventQuestion>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ eventId }/questions/${ questionId }/votes`;

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