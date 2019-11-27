'use strict';

import { Module } from 'vuex';

import { IAppMessage }    from '@/interfaces/IAppMessage';
import { AppMessageType } from '@/constants';

const DEFAULT_TIMEOUT: number = 5000; // 5 seconds

export const appModule: Module<any, any> = {
    state: {
        appMessages: <IAppMessage[]> []
    },

    getters: {
        appMessages: (state): IAppMessage[] => state.appMessages || []
    },

    mutations: {
        addAppMessage(state, message: IAppMessage): void{
            state.appMessages.push(message);
        },

        removeAppMessage(state, message: IAppMessage): void{
            const idx = state.appMessages.indexOf(message);

            if(~idx){
                state.appMessages.splice(idx, 1);
            }
        }
    },

    actions: {
        addAppMessage({ commit }, message: IAppMessage): void{

            message.type = message.type || AppMessageType.DEFAULT;

            commit('addAppMessage', message);

            if(message.autoClose){
                setTimeout(() => commit('removeAppMessage', message), message.timeout || DEFAULT_TIMEOUT);
            }
        },
        
        removeAppMessage({ commit }, message: IAppMessage): void{
            commit('removeAppMessage', message);
        }
    }
}