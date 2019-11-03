'use strict';

import Vue               from 'vue';
import Router, { Route } from 'vue-router';

import store                   from '@/store';
import { IClient, IUserToken } from '@/interfaces';

import Home      from '@/views/Home.vue';
import Login     from '@/views/Login.vue';
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
            path: '/login',
            name: 'login',
            component: Login
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

    let userToken: IUserToken|undefined = tokenService.getToken();
    if(!userToken){
        userToken = tokenService.getAnonymousToken(orgSlug);

        /*
            Re-authenticate the anon user. Since anonymous users are almost always going
            to be on a single page and may never return this shouldn't be a problem making
            too many auth requests
        */
        if(userToken){
            userToken = await userService.authenticateAnonymous(orgSlug, userToken.user.username);
        }
    }

    if(!userToken){
        const anonUser = await userService.createAnonymousUser(orgSlug);

        userToken = await userService.authenticateAnonymous(orgSlug, anonUser.username);
    }
    userToken && store.commit('setUser', userToken.user);


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

    if(!(client && client.id)){
        next('/login')
    }

    store.dispatch('openConnection');

    next()
}