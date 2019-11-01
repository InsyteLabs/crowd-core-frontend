'use strict';

import conf                    from '@/conf';
import { ClientEvent }         from '@/models';
import { IEventQuestion, IEventMessage }      from '@/interfaces';
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

        const updatedQuestion: IEventQuestion = await http.post<IEventQuestion>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(body)
        });
        
        return updatedQuestion;
    }

    /*
        ==================
        EVENT CHAT METHODS
        ==================
    */
    async getMessages(clientId: number, eventId: number): Promise<IEventMessage[]>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ eventId }/chat`;

        const messages: IEventMessage[] = await http.get<IEventMessage[]>({ url });

        return messages;
    }

    async addMessage(clientId: number, eventId: number, message: IEventMessage): Promise<IEventMessage>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ eventId }/chat`;

        const newMessage: IEventMessage = await http.post<IEventMessage>({
            url,
            headers: JSON_HEADERS,
            body: JSON.stringify(message)
        });

        return newMessage;
    }

    async deleteMessage(clientId: number, eventId: number, id: number): Promise<IEventMessage>{
        const url = `${ apiUrl }/clients/${ clientId }/events/${ eventId }/chat/${ id }`;

        const deletedMessage: IEventMessage = await http.delete<IEventMessage>({ url });

        return deletedMessage;
    }
}

export const eventService = new EventService();