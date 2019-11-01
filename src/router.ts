'use strict';

import Vue               from 'vue';
import Router, { Route } from 'vue-router';

import store                   from '@/store';
import { IClient, IUserToken } from '@/interfaces';

import Home      from '@/views/Home.vue';
import OrgHome   from '@/views/OrgHome.vue';
import OrgUsers  from '@/views/OrgUsers.vue';
import OrgEvents from '@/views/OrgEvents.vue';
import OrgEvent  from '@/views/OrgEvent.vue';

import { clientService, userService, tokenService } from '@/services';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/:orgSlug',
            name: 'org-home',
            component: OrgHome,
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/users',
            name: 'org-users',
            component: OrgUsers,
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/events',
            name: 'org-events',
            component: OrgEvents,
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/events/:eventSlug',
            name: 'org-event',
            component: OrgEvent,
            beforeEnter: beforeEnterGuard
        }
    ]
});

async function beforeEnterGuard(to: Route, from: Route, next: Function): Promise<void>{
    if(!to.params.hasOwnProperty('orgSlug')) return next();

    const orgSlug: string = to.params.orgSlug;

    let client: IClient = store.getters.client;
    if(client){
        // Handle client switching /client-a -> /client-b
        if(client.slug !== orgSlug){
            client = await clientService.getClientBySlug(orgSlug);
        }
    }
    else {
        client = await clientService.getClientBySlug(orgSlug);

        store.commit('setClient', client);
    }

    if(!client){
        console.log('CLIENT NOT FOUND');
        return;
    }

    store.dispatch('openConnection');

    const userToken: IUserToken|undefined = tokenService.getToken();
    if(userToken){
        store.commit('setUser', userToken.user);

        return next();
    }


    const anonToken: IUserToken|undefined = tokenService.getAnonymousToken(client.slug);
    if(anonToken){
        store.commit('setUser', anonToken.user);

        return next();
    }

    const anonUser = await userService.createAnonymousUser(<number>client.id);
    
    const anonUserToken: IUserToken|undefined = await userService.authenticateAnonymous(client.slug, anonUser.username);
    if(anonUserToken){
        store.commit('setUser', anonUserToken.user);

        return next();
    }
}