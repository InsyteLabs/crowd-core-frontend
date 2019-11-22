'use strict';

import Vue               from 'vue';
import Router, { Route } from 'vue-router';

import store                   from '@/store';
import { IClient, IUserToken, IJWTPayload } from '@/interfaces';

import Home      from '@/views/Home.vue';

import { clientService, userService, tokenService } from '@/services';

import { jwt } from '@/utilities';

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
            component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue')
        },
        {
            path: '/:orgSlug',
            name: 'org-home',
            component: () => import(/* webpackChunkName: "OrgHome" */ '@/views/OrgHome.vue'),
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/users',
            name: 'org-users',
            component: () => import(/* webpackChunkName: "OrgUsers" */ '@/views/OrgUsers.vue'),
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/events',
            name: 'org-events',
            component: () => import(/* webpackChunkName: "OrgEvents" */ '@/views/OrgEvents.vue'),
            beforeEnter: beforeEnterGuard
        },
        {
            path: '/:orgSlug/events/:eventSlug',
            name: 'org-event',
            component: () => import(/* webpackChunkName: "OrgEvent" */ '@/views/OrgEvent.vue'),
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
        
        if(userToken){

            const tokenPayload: IJWTPayload = jwt.decode(userToken.jwt),
                  isExpired:    boolean     = jwt.isExpired(tokenPayload);

            if(isExpired){
                userToken = await userService.authenticateAnonymous(orgSlug, userToken.user.username);
            }
        }
    }

    if(!userToken){
        const anonUser = await userService.createAnonymousUser(orgSlug);

        userToken = await userService.authenticateAnonymous(orgSlug, anonUser.username);
    }
    userToken && store.commit('user/setUser', userToken.user);


    let client: IClient = store.getters.client;
    if(client){
        // Handle client switching /client-a -> /client-b
        if(client.slug !== orgSlug){
            client = await clientService.getClientBySlug(orgSlug);
        }
    }
    else {
        client = await clientService.getClientBySlug(orgSlug);

        store.commit('client/setClient', client);
    }

    if(!(client && client.id)){
        let path = `/login?anonymous=true&to=${ encodeURIComponent(to.path) }`;

        const domain: string = to.params.orgSlug;
        domain && (path += `&domain=${ encodeURIComponent(domain) }`);

        return next(path);
    }

    store.dispatch('ws/openConnection');

    next();
}