'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import { userService, clientService } from '@/services';
import { IClient, IAppMessage }       from '@/interfaces';
import { User }                       from '@/models';
import { AppMessageType }             from '@/constants';

import { eventModule, websocketModule } from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({

    modules: {
        eventModule,
        websocketModule
    },

    state: {
        client:      <IClient|null>     null,
        users:       <User[]>           [],
        user:        <User|null>        null,
        appMessages: <IAppMessage[]>    []
    },

    getters: {
        client(state):      IClient|null     { return state.client      },
        users(state):       User[]           { return state.users       },
        user(state):        User|null        { return state.user        },
        appMessages(state): IAppMessage[]    { return state.appMessages },
    },

    mutations: {
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
            const users: User[] = state.users;

            if(!users || !Array.isArray(users)){
                state.users = [ user ];
                return;
            }

            const idx = users.findIndex(u => u.id === user.id);
            if(~idx){
                users.splice(idx, 1, user);
            }

        },
        deleteUser(state, user: User): void{
            const users: User[] = state.users;

            if(!(users && Array.isArray(users))) return;

            const idx = users.findIndex(u => u.id === user.id);
            if(~idx){
                users.splice(idx, 1);
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
    },

    actions: {
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


        /*
            ==============
            CLIENT METHODS
            ==============
        */
        async loadClientById({ commit, dispatch }, clientId: number): Promise<IClient>{
            const client: IClient = await clientService.getClient(clientId);

            commit('setClient', client);

            dispatch('openConnection');

            return client;
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
        }
    }
});

export default store;