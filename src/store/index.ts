'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import { IAppMessage }    from '@/interfaces';
import { AppMessageType } from '@/constants';

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
        appModule,
        userModule,
        clientModule,
        eventModule,
        websocketModule
    }
});

export default store;