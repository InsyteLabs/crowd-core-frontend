'use strict';

import { Module } from 'vuex';
import { IWebSocketMessage, IEventQuestion, IEventMessage } from '@/interfaces';
import { ClientEvent, User } from '@/models';
import { AppMessageType } from '@/constants';

const SOCKET_INTERVAL: number = 10000; // 10 seconds

export const websocketModule: Module<any, any> = {
    state: {
        socket:      <WebSocket|null> null,
        socketTimer: <number|null>    null
    },

    getters: {
        socket:      (state): WebSocket|null => state.socket,
        socketTimer: (state): number|null    => state.socketTimer
    },

    mutations: {
        setSocket(state, socket: WebSocket): void{
            state.socket = socket;
        },

        setSocketTimer(state, timer: number): void{
            state.socketTimer = timer;
        }
    },

    actions: {
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
                    ==========
                    EVENT CHAT
                    ==========
                */
                case 'message-created':
                    const newMessage: IEventMessage = msg.data;

                    console.log('MESSAGE CREATED');
                    console.log(newMessage);

                    commit('addMessage', newMessage);

                    break;
                
                case 'message-updated':
                    const updatedMessage: IEventMessage = msg.data;

                    console.log('MESSAGE UPDATED');
                    console.log(updatedMessage);

                    commit('updateMessage', updatedMessage);

                    break;

                case 'message-deleted':
                    const deletedMessage: IEventMessage = msg.data;

                    console.log('MESSAGE DELETED');
                    console.log(deletedMessage);

                    commit('deleteMessage', deletedMessage);

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

            dispatch('app/addAppMessage', {
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

                const timer = setInterval(() => store.dispatch('testConnection'), SOCKET_INTERVAL);

                store.commit('setSocketTimer', timer);
            }
        },

        reopenConnection(store): void{
            const socket: WebSocket = store.getters.socket;

            if(socket){
                socket.close();
                store.commit('setSocket', null);

                clearInterval(store.getters.socketTimer);
            }

            store.dispatch('openConnection');
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
}