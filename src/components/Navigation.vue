<template>
    <nav :class="{ hidden: !visible }" id="nav">
        <router-link v-if="client" :to="'/' + client.slug">HOME</router-link>
        <router-link v-if="!client" to="/">HOME</router-link>
        <router-link v-if="client" :to="'/' + client.slug + '/users'">USERS</router-link>
        <router-link v-if="client" :to="'/' + client.slug + '/events'">EVENTS</router-link>
    </nav>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop } from 'vue-property-decorator';

import { IClient } from '../interfaces';
import { User }    from '../models';

@Component
export default class Navigation extends Vue {
    @Prop() visible!: boolean;

    /*
        =======
        GETTERS
        =======
    */
    get user(): User{
        return this.$store.getters.user;
    }

    get client(): IClient{
        return this.$store.getters.client;
    }

}
</script>

<style scoped lang="sass">

@import '@/style/variables'

a, a:visited, a:active, a:hover
    color: white
    display: block
    width: 100%
    padding: .6rem 1.2rem
    text-decoration: none

    &.router-link-exact-active
        background-color: $purple

#nav
    z-index: 1
    position: fixed
    height: 100%
    padding-top: 80px
    width: 250px
    background-color: $gray
    color: white

    left: 0
    top: 0

    transition: all .2s ease-in-out

    &.hidden
        left: -250px

</style>