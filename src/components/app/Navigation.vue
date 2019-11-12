<template>
    <div class="container-fluid p-0">
        <nav id="nav">
            <router-link v-if="!(client && client.id)" to="/">HOME</router-link>
            
            <router-link v-if="client && client.slug" :to="'/' + client.slug">HOME</router-link>
            <router-link v-if="client && client.slug" :to="'/' + client.slug + '/users'">USERS</router-link>
            <router-link v-if="client && client.slug" :to="'/' + client.slug + '/events'">EVENTS</router-link>
        </nav>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';

import { IClient } from '@/interfaces';
import { User }    from '@/models';

@Component
export default class Navigation extends Vue {

    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters['user/user'];
    }

    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }
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