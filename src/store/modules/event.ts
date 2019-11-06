'use strict';

import { Module } from 'vuex';

import { eventService }         from '@/services';
import { ClientEvent }          from '@/models';
import { sortQuestionsByScore } from '@/utilities';

import {
    IEventQuestion, IEventMessage, IClientEventDescriptor
} from '@/interfaces';


export const eventModule: Module<any, any> = {
    state: {
        events: <ClientEvent[]>    [],
        event:  <ClientEvent|null> null
    },

    getters: {
        events: (state): ClientEvent[]    => state.events,
        event:  (state): ClientEvent|null => state.event
    },

    mutations: {
        /*
            =============
            EVENT METHODS
            =============
        */
        setEvents(state, events: ClientEvent[]): void{
            state.events = events || [];
        },
        addEvent(state, event: ClientEvent): void{
            if(!(state.events && Array.isArray(state.events))){
                state.events = [ event ];
                return;
            }

            state.events.push(event);
        },
        setEvent(state, event: ClientEvent): void{
            if(!(event && event.id)) state.event = null;

            event.questions = event.questions || [];
            event.questions = event.questions.sort(sortQuestionsByScore);

            state.event = event;
        },
        updateEvent(state, event: ClientEvent): void{
            const events: ClientEvent[] = state.events;

            if(!events || !Array.isArray(events)){
                state.events = [ event ];
                return;
            }

            const idx = events.findIndex(e => e.id === event.id);
            if(~idx){
                events.splice(idx, 1, event);
            }

            // If the updated event is the same as the current event, update it
            if(state.event){
                if(state.event.id === event.id){
                    event.questions = state.event.questions;
                    event.messages  = state.event.messages;

                    state.event = event;
                }
            }
        },
        deleteEvent(state, event: ClientEvent): void{
            const events: ClientEvent[] = state.events;

            if(!(events && Array.isArray(events))) return;

            const idx = events.findIndex(e => e.id === event.id);
            if(~idx){
                events.splice(idx, 1);
            }
        },

        /*
            ======================
            EVENT QUESTION METHODS
            ======================
        */
       addQuestion(state, question: IEventQuestion): void{
            const { eventId }: { eventId: number } = question;

            if(state.event && state.event.id === eventId){
                state.event.questions.push(question);

                state.event.questions = state.event.questions.sort(sortQuestionsByScore);
            }
        },
        updateQuestion(state, question: IEventQuestion): void{
            const { eventId }: { eventId: number } = question;

            if(state.event && state.event.id === eventId){
                const { questions }: { questions: IEventQuestion[] } = state.event;

                const idx = questions.findIndex(q => q.id === question.id);
                if(~idx){
                    questions.splice(idx, 1, question);

                    state.event.questions = state.event.questions.sort(sortQuestionsByScore);
                }
            }
        },
        deleteQuestion(state, question: IEventQuestion): void{
            const { eventId }: { eventId: number } = question;

            if(state.event && state.event.id === eventId){
                const { questions }: { questions: IEventQuestion[] } = state.event;

                const idx = questions.findIndex(q => q.id === question.id);
                if(~idx){
                    questions.splice(idx, 1);
                }
            }
        },

        
        /*
            ==================
            EVENT CHAT METHODS
            ==================
        */
        addMessage(state, message: IEventMessage): void{
            const { eventId }: { eventId: number } = message;

            if(state.event && state.event.id === eventId){
                const { messages }: { messages: IEventMessage[] } = state.event;

                messages.push(message);
            }

        },
        updateMessage(state, message: IEventMessage): void{
            const { eventId }: { eventId: number } = message;

            if(state.event && state.event.id === eventId){
                const { messages }: { messages: IEventMessage[] } = state.event;

                const idx = messages.findIndex(m => m.id === message.id);
                if(~idx){
                    messages.splice(idx, 1, message);
                }
            }
        },
        deleteMessage(state, message: IEventMessage): void{
            const { eventId }: { eventId: number } = message;

            if(state.event && state.event.id === eventId){
                const { messages }: { messages: IEventMessage[] } = state.event;

                const idx = messages.findIndex(m => m.id === message.id);
                if(~idx){
                    messages.splice(idx, 1);
                }
            }
        },
    },


    actions: {
        /*
            =============
            EVENT METHODS
            =============
        */
        async loadEvents({ commit }, clientId: number): Promise<ClientEvent[]>{
            const events: ClientEvent[] = await eventService.getEvents(clientId);

            commit('setEvents', events);

            return events;
        },
        
        async loadEvent({ commit }, descriptor: IClientEventDescriptor): Promise<ClientEvent>{
            const event: ClientEvent = await eventService.getEvent(descriptor.clientId, descriptor.eventSlug);

            commit('setEvent', event);

            return event;
        },
    }
}