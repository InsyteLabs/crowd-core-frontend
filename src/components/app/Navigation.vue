<template>
    <div class="container-fluid p-0">
        <nav @click="shouldClose()" id="nav">
            <router-link v-if="!(client && client.id)" to="/">HOME</router-link>
            
            <router-link v-if="showHomeLink" :to="'/' + client.slug">HOME</router-link>
            <router-link v-if="showUsersLink" :to="'/' + client.slug + '/users'">USERS</router-link>
            <router-link v-if="showEventsLink" :to="'/' + client.slug + '/events'">EVENTS</router-link>
        </nav>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Emit } from 'vue-property-decorator';

import { currentUserService, CurrentUserService } from '@/services';
import { IClient }                                from '@/interfaces';
import { User }                                   from '@/models';

@Component
export default class Navigation extends Vue {

    userService: CurrentUserService = currentUserService;

    shouldClose(): void{
        if(window.innerWidth <= 768) this.close();
    }

    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.userService.user;
    }

    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }

    get showHomeLink(): boolean{
        return !!(
               this.client
            && this.client.slug
            && this.user
            && !this.user.isAnonymous
        );
    }

    get showEventsLink(): boolean{
        return !!(
               this.client
            && this.client.slug
        );
    }

    get showUsersLink(): boolean{
        // return true;
        return !!(
               this.client
            && this.client.slug
            && this.user
            && !this.user.isAnonymous
        );
    }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('close')
    close(): void{ }
}
</script>

<style scoped lang="sass">

@import '@/style/variables'

a, a:visited, a:active, a:hover
    color: white
    display: block
    width: 100%
    padding: .7rem 1.2rem
    font-size: 1.1rem
    text-decoration: none

    &.router-link-exact-active
        background-color: $purple

#nav
    height: 100%
    background-color: $gray
    color: white

</style>