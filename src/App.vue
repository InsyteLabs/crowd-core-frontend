<template>
    <div id="app">
        <AppMessages ref="messages"></AppMessages>

        <Banner
            @toggleNav="onToggleNav($event);"
            @userClick="onUserClick();">
        </Banner>

        <Navigation :visible="navigationVisible"></Navigation>

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

import { Vue, Component, Ref } from 'vue-property-decorator';

import { userService, clientService } from '@/services';
import { User }                       from './models';
import { IClient, IUserToken }        from './interfaces';

import Banner      from '@/components/Banner.vue';
import Navigation  from '@/components/Navigation.vue';
import AppMessages from '@/components/AppMessages.vue';
import LoginForm   from '@/components/LoginForm.vue';

@Component({
    components: {
        Banner,
        Navigation,
        AppMessages,
        LoginForm
    }
})
export default class App extends Vue{
    @Ref('messages') messages!: AppMessages;

    navigationVisible: boolean = true;
    loginFormVisible:  boolean = false;
    loggedIn:          boolean = (this.user && this.user.id) ? true : false;

    async created(): Promise<void>{
        // await this.$store.dispatch('loadUserToken');
    }

    onToggleNav(){
        this.navigationVisible = !this.navigationVisible;
    }

    onUserClick(){
        this.loginFormVisible = !this.loginFormVisible;
    }

    async onLoginClick(o: any): Promise<any>{
        let token: IUserToken|void = await userService.authenticate(o.username, o.password);

        if(!token){
            console.error('Incorrect username/password');
            return;
        }

        const user = new User(token.data);

        this.$store.dispatch('saveUserToken', JSON.stringify(token));
        this.$store.commit('setUser', user);

        if(user && user.clientId){
            let client: IClient = await clientService.getClient(user.clientId);

            this.$store.commit('setClient', client);

            this.$router.push({
                name: 'org-home',
                params: {
                    orgSlug: client.slug
                }
            });
        }
    }


    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient{
        return this.$store.getters.client;
    }

    get user(): User{
        return this.$store.getters.user;
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
