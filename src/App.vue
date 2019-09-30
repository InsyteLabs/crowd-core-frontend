<template>
    <div id="app">
        <Banner
            @toggleNav="onToggleNav($event);">
        </Banner>
        <Navigation
            :visible="navigationVisible">
        </Navigation>

        <div id="main" class="container-fluid" :class="{ compact: navigationVisible }">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';

import Banner     from '@/components/Banner.vue';
import Navigation from '@/components/Navigation.vue';

@Component({
    components: {
        Banner,
        Navigation
    }
})
export default class App extends Vue{
    navigationVisible: boolean = true;

    onToggleNav(){
        this.navigationVisible = !this.navigationVisible;
    }
}

</script>

<style lang="sass">

@import './style/bootstrap.min.css'
@import './style/main'

#app
    font-family: "Avenir", Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

#main
    margin: 2rem 0
    width: 100%

    transition: width .2s ease-in-out, margin .2s ease-in-out
    
    &.compact
        width: calc(100% - 250px)
        margin: 2rem 0 2rem 250px
</style>
