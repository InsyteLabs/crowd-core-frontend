'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import {
    appModule,
    userModule,
    clientModule,
    eventModule,
    websocketModule
} from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
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
        },
        ws: {
            namespaced: true,
            ...websocketModule
        }
    }
});

export default store;