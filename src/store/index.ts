'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import {
    appModule,
    userModule,
    clientModule,
    eventModule
} from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        pendingHttpCount: <number> 0
    },

    getters: {
        pendingHttpCount: (state): number => state.pendingHttpCount
    },

    mutations: {
        incrementPendingHttpCount(state){
            ++state.pendingHttpCount;
        },
        decrementPendingHttpCount(state){
            --state.pendingHttpCount
        }
    },

    modules: {
        app: {
            namespaced: true,
            ...appModule
        },
        user: {
            namespaced: true,
            ...userModule
        },
        client: {
            namespaced: true,
            ...clientModule
        },
        event: {
            namespaced: true,
            ...eventModule
        }
    }
});

export default store;