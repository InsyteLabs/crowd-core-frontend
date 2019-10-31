'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import { userService, clientService, eventService } from '@/services';
import { User, ClientEvent }                        from '@/models';
import { AppMessageType }                           from '@/constants';

import {
    IClient, IUserToken, IClientEventDescriptor, IWebSocketMessage, IAppMessage, IEventQuestion
} from '@/interfaces';


Vue.use(Vuex);

const SOCKET_INTERVAAL: number = 10000; // 10 seconds

const store = new Vuex.Store({
    state: {
        client:      <IClient|null>     null,
        users:       <User[]>           [],
        user:        <User|null>        null,
        socket:      <WebSocket|null>   null,
        socketTimer: <number|null>      null,
        events:      <ClientEvent[]>    [],
        event:       <ClientEvent|null> null,
        appMessages: <IAppMessage[]>    []
    },
    getters: {
        events(state):      ClientEvent[]    { return state.events      },
        event(state):       ClientEvent|null { return state.event       },
        client(state):      IClient|null     { return state.client      },
        users(state):       User[]           { return state.users       },
        user(state):        User|null        { return state.user        },
        appMessages(state): IAppMessage[]    { return state.appMessages },
        socket(state):      WebSocket|null   { return state.socket      },
        socketTimer(state): number|null      { return state.socketTimer }
    },
    mutations: {
        /*
            =============
            EVENT METHODS
            =============
        */
        setEvents(state, events: ClientEvent[]): void{
            state.events = events;
        },
        setEvent(state, event: ClientEvent): void{
            state.event = event;
        },
        addEvent(state, event: ClientEvent): void{
            if(!(state.events && Array.isArray(state.events))){
                state.events = [ event ];
                return;
            }

            state.events.push(event);
        },
        updateEvent(state, event: ClientEvent): void{
            if(!state.events || !Array.isArray(state.events)){
                state.events = [ event ];
                return;
            }

            const idx = state.events.findIndex(e => e.id === event.id);
            if(~idx){
                state.events.splice(idx, 1, event);
            }
        },
        deleteEvent(state, event: ClientEvent): void{
            if(!(state.events && Array.isArray(state.events))) return;

            const idx = state.events.findIndex(e => e.id === event.id);
            if(~idx){
                state.events.splice(idx, 1);
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
            }
        },
        updateQuestion(state, question: IEventQuestion): void{
            const { eventId }: { eventId: number } = question;

            if(state.event && state.event.id === eventId){
                const { questions }: { questions: IEventQuestion[] } = state.event;

                const idx = questions.findIndex(q => q.id === question.id);
                if(~idx){
                    questions.splice(idx, 1, question);
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
            ==============
            CLIENT METHODS
            ==============
        */
        setClient(state, client: IClient): void{
            state.client = client;
        },


        /*
            ============
            USER METHODS
            ============
        */
        setUser(state, user: User): void{
            state.user = user;
        },
        setUsers(state, users: User[]): void{
            state.users = users;
        },
        addUser(state, user: User): void{
            if(!(state.users && Array.isArray(state.users))){
                state.users = [ user ];
            }

            state.users.push(user);
        },
        updateUser(state, user: User): void{
            if(!state.users || !Array.isArray(state.users)){
                state.users = [ user ];
                return;
            }

            const idx = state.users.findIndex(u => u.id === user.id);
            if(~idx){
                state.users.splice(idx, 1, user);
            }

        },
        deleteUser(state, user: User): void{
            if(!(state.users && Array.isArray(state.users))) return;

            const idx = state.users.findIndex(u => u.id === user.id);
            if(~idx){
                state.users.splice(idx, 1);
            }
        },


        /*
            ===================
            APP MESSAGE METHODS
            ===================
        */
        addAppMessage(state, message: IAppMessage): void{
            state.appMessages.push(message);
        },
        removeAppMessage(state, message: IAppMessage): void{
            const idx = state.appMessages.indexOf(message);

            if(~idx){
                state.appMessages.splice(idx, 1);
            }
        },


        /*
            =================
            WEBSOCKET METHODS
            =================
        */
        setSocket(state, socket: WebSocket): void{
            state.socket = socket;
        },
        setSocketTimer(state, timer: number): void{
            state.socketTimer = timer;
        }
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

            store.commit('setEvent', event);

            return event;
        },


        /*
            ============
            USER METHDOS
            ============
        */
        async loadUsers({ commit }, clientId: number): Promise<User[]>{
            const users: User[] = await userService.getUsers(clientId);

            commit('setUsers', users);

            return users;
        },

        async loadUserToken({ commit, dispatch, getters }): Promise<void>{
            let token:     string|null = localStorage.getItem('token'),
                userToken: IUserToken;

            if(!token || token.toString() === 'undefined') return;

            try{
                userToken = JSON.parse(token);
            }
            catch(e){
                console.error('Failed parsing user token from storage');
                return;
            }

            const user = new User(userToken.data);

            commit('setUser', user);

            if(user.clientId && !getters.client){
                try{
                    const client = await clientService.getClient(user.clientId);

                    commit('setClient', client);

                    dispatch('openConnection');
                }
                catch(e){
                    console.error(`Failed to load client of ID ${ user.clientId }`);
                }
            }
        },

        saveUserToken({ commit }, token: string): void{
            localStorage.setItem('token', token);
        },


        /*
            ===================
            APP MESSAGE METHODS
            ===================
        */
        addAppMessage({ commit }, message: IAppMessage): void{

            message.type = message.type || AppMessageType.DEFAULT;

            commit('addAppMessage', message);

            if(message.autoClose){
                setTimeout(() => commit('removeAppMessage', message), message.timeout || 5000);
            }
        },
        removeAppMessage({ commit }, message: IAppMessage): void{
            commit('removeAppMessage', message);
        },


        /*
            =================
            WEBSOCKET METHODS
            =================
        */
        handleMessage({ commit, dispatch }, message: string): void{
            let msg: IWebSocketMessage;
            try{
                msg = JSON.parse(message);
            }
            catch(e){
                console.error('Socket message not valid JSON');
                return;
            }

            console.group('$store.handleMessage');
            switch(msg.type){
                /*
                    ==============
                    EVENT MESSAGES
                    ==============
                */
                case 'event-created':
                    const newEvent: ClientEvent = new ClientEvent(msg.data);

                    console.log('EVENT CREATED');
                    console.log(newEvent);

                    commit('addEvent', newEvent);

                    break;
                case 'event-updated':
                    const updatedEvent: ClientEvent = new ClientEvent(msg.data);

                    console.log('EVENT UPDATED');
                    console.log(updatedEvent);

                    commit('updateEvent', updatedEvent);

                    break;
                case 'event-deleted':
                    const deletedEvent: ClientEvent = new ClientEvent(msg.data);

                    console.log('EVENT DELETED');
                    console.log(deletedEvent);

                    commit('deleteEvent', deletedEvent);

                    break;

                
                /*
                    =======================
                    EVENT QUESTION MESSAGES
                    =======================
                */
                case 'question-created':
                    const newQuestion: IEventQuestion = msg.data;

                    console.log('QUESTION CREATED');
                    console.log(newQuestion);

                    commit('addQuestion', newQuestion);

                    break;
                case 'question-updated':
                    const updatedQuestion: IEventQuestion = msg.data;

                    console.log('QUESTION UPDATED');
                    console.log(updatedQuestion);

                    commit('updateQuestion', updatedQuestion);

                    break;
                case 'question-deleted':
                    const deletedQuestion: IEventQuestion = msg.data;

                    console.log('QUESTION DELETED');
                    console.log(deletedQuestion);

                    commit('deleteQuestion', deletedQuestion);

                    break;


                /*
                    =============
                    USER MESSAGES
                    =============
                */
                case 'user-created':
                    const newUser: User = new User(msg.data);

                    console.log('USER CREATED');
                    console.log(newUser);

                    commit('addUser', newUser);

                    break;
                case 'user-updated':
                    const updatedUser: User = new User(msg.data);

                    console.log('USER UPDATED');
                    console.log(updatedUser);

                    commit('updateUser', updatedUser);

                    break;
                case 'user-deleted':
                    const deletedUser: User = new User(msg.data);

                    console.log('USER DELETED');
                    console.log(deletedUser);

                    commit('deleteUser', deletedUser);

                    break;

                /*
                    =======
                    DEFAULT
                    =======
                */
                default:
                    console.log('UNKNOWN MESSAGE RECEIVED');
                    console.log(msg);
            }
            
            console.groupEnd();

            dispatch('addAppMessage', {
                text: `WS: ${ msg.type }`,
                type: AppMessageType.INFO,
                autoClose: true,
                timeout: 3000
            });
        },

        openConnection(store): void{
            if(!store.getters.client) return;
            if(!window.WebSocket)     return;

            let socket: WebSocket|null = store.getters.socket;
            
            if(!socket || ![socket.CONNECTING, socket.OPEN].includes(socket.readyState)){
                socket = new WebSocket(`ws://localhost:8080/client/${ store.getters.client.slug }`);

                socket.addEventListener('open', (ev) => {
                    console.group('$store.openConnection')
                    console.log('Connection Opened');
                    console.log(ev);
                    console.groupEnd();
                });

                socket.addEventListener('message', (ev: MessageEvent) => {
                    store.dispatch('handleMessage', ev.data);
                });

                store.commit('setSocket', socket);

                clearInterval(store.getters.socketTimer);

                const timer = setInterval(() => store.dispatch('testConnection'), SOCKET_INTERVAAL);

                store.commit('setSocketTimer', timer);
            }
            else{
                console.log('Connection already open');
            }
        },

        testConnection(store): void{
            const socket: WebSocket = store.getters.socket;

            let err: string = '';

            if(!socket){
                err = 'Socket was falsy, re-opening';
            }

            else if(![socket.OPEN, socket.CONNECTING].includes(socket.readyState)){
                err = 'Socket not connected, re-opening';
            }
            else{
                try{
                    socket.send('{"type": "test-connection"}');
                }
                catch(e){
                    err = 'Socket unable to send data, re-opening';
                }
            }

            if(err){
                console.group(`$store.testConnection`);
                console.error(`Socket Error: ${ err }`);
                console.log('Reconnecting...');
                console.groupEnd();

                store.dispatch('openConnection');
            }
        }
    }
});

/*
    ====================
    STORE INITIALIZATION
    ====================
*/
store.dispatch('loadUserToken');

export default store;