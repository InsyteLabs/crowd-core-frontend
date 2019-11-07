'use strict';

import { Module } from 'vuex';

import { clientService } from '@/services';
import { IClient }       from '@/interfaces';

export const clientModule: Module<any, any> = {
    state: {
        client: <IClient|null> null,
    },

    getters: {
        client: (state): IClient|null => state.client
    },

    mutations: {
        setClient(state, client: IClient): void{
            state.client = client;
        }
    },

    actions: {
        async loadClientById({ commit, dispatch }, clientId: number): Promise<IClient>{
            const client: IClient = await clientService.getClient(clientId);

            commit('setClient', client);

            dispatch('ws/openConnection', null, { root: true });

            return client;
        },

        async loadClientBySlug({ commit, dispatch }, slug: string): Promise<IClient>{
            const client: IClient = await clientService.getClientBySlug(slug);

            commit('setClient', client);

            dispatch('ws/openConnection', null, { root: true });

            return client;
        }
    }
}