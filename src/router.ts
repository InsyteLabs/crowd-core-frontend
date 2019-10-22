'use strict';

import Vue    from 'vue';
import Router from 'vue-router';

import Home      from '@/views/Home.vue';
import Users     from '@/views/Users.vue';
import OrgHome   from '@/views/OrgHome.vue';
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
            component: OrgHome
        },
        {
            path: '/:orgSlug/users',
            name: 'org-users',
            component: Users
        },
        {
            path: '/:orgSlug/events',
            name: 'org-events',
            component: OrgEvents
        },
        {
            path: '/:orgSlug/events/:eventSlug',
            name: 'org-event',
            component: OrgEvent
        }
    ]
});