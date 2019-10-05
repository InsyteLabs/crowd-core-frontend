'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import { IClient } from '@/interfaces';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        client: <IClient|null>null
    },
    getters: {
        client(state){ return state.client }
    },
    mutations: {
        setClient(state, client: IClient){
            state.client = client;
        }
    },
    actions: {

    }
});