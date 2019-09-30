<template>
    <div id="app">
        <Banner
            @toggleNav="onToggleNav($event);"
            @userClick="onUserClick();">
        </Banner>
        <Navigation
            :visible="navigationVisible">
        </Navigation>

        <div v-show="loginFormVisible" class="login-form">
            <LoginForm @login="onLoginClick($event);"></LoginForm>
        </div>

        <div id="main" class="container-fluid" :class="{ compact: navigationVisible }">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';

import { userService } from '@/services';

import Banner     from '@/components/Banner.vue';
import Navigation from '@/components/Navigation.vue';
import LoginForm  from '@/components/LoginForm.vue';

@Component({
    components: {
        Banner,
        Navigation,
        LoginForm
    }
})
export default class App extends Vue{
    navigationVisible: boolean = true;
    loginFormVisible:  boolean = false;
    loggedIn:          boolean = false;

    onToggleNav(){
        this.navigationVisible = !this.navigationVisible;
    }

    onUserClick(){
        this.loginFormVisible = !this.loginFormVisible;
    }

    async onLoginClick(o: any): Promise<any>{
        let token = await userService.authenticate(o.username, o.password);

        if(!(token && token.data)){
            console.log('Incorrect username/password');
        }
        else{
            console.log('Login successful');
            console.log(token);
        }
    }
}

</script>

<style lang="sass">

@import './style/bootstrap.min.css'
@import './style/main'

#app
    position: relative
    font-family: "Avenir", Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

#main
    margin: 2rem 0
    width: 100%
    z-index: 0

    transition: width .2s ease-in-out, margin .2s ease-in-out
    
    &.compact
        width: calc(100% - 250px)
        margin: 2rem 0 2rem 250px

.login-form
    width: 575px
    max-width: 90%
    position: absolute
    right: 5px
    top: 85px
    z-index: 10
</style>
