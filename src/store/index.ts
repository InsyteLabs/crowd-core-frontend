'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import { IAppMessage }    from '@/interfaces';
import { AppMessageType } from '@/constants';

import {
    userModule,
    clientModule,
    eventModule,
    websocketModule
} from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({

    modules: {
        userModule,
        clientModule,
        eventModule,
        websocketModule
    },

    state: {
        appMessages: <IAppMessage[]> []
    },

    getters: {
        appMessages(state): IAppMessage[] { return state.appMessages },
    },

    mutations: {
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