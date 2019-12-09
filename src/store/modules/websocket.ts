'use strict';

import { Module } from 'vuex';

import { IWebSocketMessage, IEventQuestion, IEventMessage } from '@/interfaces';
import { ClientEvent, User }                                from '@/models';
import { AppMessageType }                                   from '@/constants';
import conf                                                 from '@/conf';

const SOCKET_INTERVAL: number = 3000; // 3 seconds

export const websocketModule: Module<any, any> = {
    state: {
        socket:      <WebSocket|null> null,
        socketTimer: <number|null>    null
    },

    getters: {
        socket:      (state): WebSocket|null => state.socket,
        socketTimer: (state): number|null    => state.socketTimer,

        connected(state): boolean{
            if(!state.socket) return false;

            return [
                WebSocket.CONNECTING,
                WebSocket.OPEN
            ].includes(state.socket.readyState)
        }
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

                    commit('event/addEvent', newEvent, { root: true });

                    break;
                case 'event-updated':
                    const updatedEvent: ClientEvent = new ClientEvent(msg.data);

                    console.log('EVENT UPDATED');
                    console.log(updatedEvent);

                    commit('event/updateEvent', updatedEvent, { root: true });

                    break;
                case 'event-deleted':
                    const deletedEvent: ClientEvent = new ClientEvent(msg.data);

                    console.log('EVENT DELETED');
                    console.log(deletedEvent);

                    commit('event/deleteEvent', deletedEvent, { root: true });

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

                    dispatch('event/addQuestion', newQuestion, { root: true });

                    break;
                case 'question-updated':
                    const updatedQuestion: IEventQuestion = msg.data;

                    console.log('QUESTION UPDATED');
                    console.log(updatedQuestion);

                    dispatch('event/updateQuestion', updatedQuestion, { root: true });

                    break;
                case 'question-deleted':
                    const deletedQuestion: IEventQuestion = msg.data;

                    console.log('QUESTION DELETED');
                    console.log(deletedQuestion);

                    dispatch('event/deleteQuestion', deletedQuestion, { root: true });

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

                    commit('event/addMessage', newMessage, { root: true });

                    break;
                
                case 'message-updated':
                    const updatedMessage: IEventMessage = msg.data;

                    console.log('MESSAGE UPDATED');
                    console.log(updatedMessage);

                    commit('event/updateMessage', updatedMessage, { root: true });

                    break;

                case 'message-deleted':
                    const deletedMessage: IEventMessage = msg.data;

                    console.log('MESSAGE DELETED');
                    console.log(deletedMessage);

                    commit('event/deleteMessage', deletedMessage, { root: true });

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

                    commit('user/addUser', newUser, { root: true });

                    break;
                case 'user-updated':
                    const updatedUser: User = new User(msg.data);

                    console.log('USER UPDATED');
                    console.log(updatedUser);

                    commit('user/updateUser', updatedUser, { root: true });

                    break;
                case 'user-deleted':
                    const deletedUser: User = new User(msg.data);

                    console.log('USER DELETED');
                    console.log(deletedUser);

                    commit('user/deleteUser', deletedUser, { root: true });

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
            }, { root: true });
        },

        openConnection({ commit, dispatch, getters, rootGetters }): void{
            if(!rootGetters['client/client']) return;
            if(!window.WebSocket)             return;

            let socket: WebSocket|null = getters.socket;
            
            if(!socket || ![socket.CONNECTING, socket.OPEN].includes(socket.readyState)){
                socket = new WebSocket(`${ conf.wsUrl }/websocket?channel=${ rootGetters['client/client'].slug }`);

                socket.addEventListener('open', (ev) => {
                    console.group('$store.openConnection')
                    console.log('Connection Opened');
                    console.log(ev);
                    console.groupEnd();
                });

                socket.addEventListener('message', (ev: MessageEvent) => {
                    dispatch('handleMessage', ev.data);
                });

                commit('setSocket', socket);

                clearInterval(getters.socketTimer);

                const timer = setInterval(() => dispatch('testConnection'), SOCKET_INTERVAL);

                commit('setSocketTimer', timer);
            }
        },

        reopenConnection({ commit, dispatch, getters }): void{
            const socket: WebSocket = getters.socket;

            if(socket){
                socket.close();
                commit('setSocket', null);

                clearInterval(getters.socketTimer);
            }

            dispatch('openConnection');
        },

        testConnection({ dispatch, getters }): void{
            const socket: WebSocket = getters.socket;

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

                dispatch('openConnection');
            }
        }
    }
}