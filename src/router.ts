'use strict';

import Vue    from 'vue';
import Router from 'vue-router';

import Home      from '@/views/Home.vue';
import Users     from '@/views/Users.vue';
import OrgHome   from '@/views/OrgHome.vue';
import OrgEvents from '@/views/OrgEvents.vue';

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
            path: '/users',
            name: 'users',
            component: Users
        },
        {
            path: '/orgs/:slug',
            name: 'org-home',
            component: OrgHome
        },
        {
            path: '/orgs/:slug/events',
            name: 'org-events',
            component: OrgEvents
        }
    ]
});