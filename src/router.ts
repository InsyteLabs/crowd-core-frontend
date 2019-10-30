'use strict';

import Vue    from 'vue';
import Router, { Route } from 'vue-router';

import store                   from '@/store';
import { User }                from '@/models';
import { IClient, IUserToken } from '@/interfaces';
import { clientService }       from '@/services';

import Home      from '@/views/Home.vue';
import OrgHome   from '@/views/OrgHome.vue';
import OrgUsers  from '@/views/OrgUsers.vue';
import OrgEvents from '@/views/OrgEvents.vue';
import OrgEvent  from '@/views/OrgEvent.vue';

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
    if(!client){
        client = await clientService.getClientBySlug(orgSlug);
    }

    if(!client){
        console.log('CLIENT NOT FOUND');
        return;
    }

    const user = getLocalStorageUser();
    
    next();
}


function getLocalStorageUser(): User|void{
    const token: IUserToken|void = getUserToken();

    if(!token) return;

    return new User(token.data);
}

function getUserToken(): IUserToken|void{
    let token = localStorage.getItem('token');

    if(!token) return;

    try{
        const userToken: IUserToken = JSON.parse(token);

        return userToken;
    }
    catch(e){
        console.error('Error parsing user token from localStorage');
        console.error(e);

        return;
    }
}