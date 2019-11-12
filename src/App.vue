<template>
    <div id="app">
        <AppMessages ref="messages"></AppMessages>

        <Banner
            @toggleNav="onToggleNav($event);"
            @userClick="onUserClick();">
        </Banner>

        <div class="nav" :class="{ hidden: !navigationVisible }">
            <Navigation :visible="navigationVisible"></Navigation>
        </div>

        <div v-show="userProfileVisible" class="profile">
            <div @click="onUserClick();" class="profile-bg"></div>
            <UserProfile
                @login="onLoginClick()"
                @logout="onLogoutClick()">
            </UserProfile>
        </div>

        <div id="main" class="container-fluid" :class="{ compact: navigationVisible }">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Ref } from 'vue-property-decorator';

import { userService, clientService, tokenService } from '@/services';
import { User }                                     from '@/models';
import { IClient, IUserToken }                      from '@/interfaces';

import Banner      from '@/components/app/Banner.vue';
import Navigation  from '@/components/app/Navigation.vue';
import AppMessages from '@/components/app/AppMessages.vue';
import UserProfile from '@/components/user/UserProfile.vue';

@Component({
    components: {
        Banner,
        Navigation,
        AppMessages,
        UserProfile
    }
})
export default class App extends Vue{
    @Ref('messages') messages!: AppMessages;

    navigationVisible:  boolean = true;
    userProfileVisible: boolean = false;
    loggedIn:           boolean = (this.user && this.user.id) ? true : false;


    onToggleNav(){
        this.navigationVisible = !this.navigationVisible;
    }

    onUserClick(){
        if(!(this.user && this.user.id)){
            if(this.$route.path.includes('login')) return;

            return this.$router.push('/login');
        }
        
        this.userProfileVisible = !this.userProfileVisible;
    }

    onLoginClick(): void{
        this.userProfileVisible = false;

        let path: string = this.$route.path,
            to:   string = '';

        if(path){
            to = encodeURIComponent(path);
        }

        this.$router.push(`/login${ to ? '?to='+to : '' }`);
    }

    async onLogoutClick(): Promise<void>{
        tokenService.deleteToken();

        this.$store.commit('user/setUser', null);

        const orgSlug: string = this.$route.params.orgSlug;
        if(orgSlug){
            let userToken: IUserToken|void = tokenService.getAnonymousToken(orgSlug);

            if(userToken){
                userToken = await userService.authenticateAnonymous(orgSlug, userToken.user.username);
            }
            else{
                const anonUser = await userService.createAnonymousUser(orgSlug);

                userToken = await userService.authenticateAnonymous(orgSlug, anonUser.username);
            }

            userToken && this.$store.commit('user/setUser', userToken.user);
        }

        this.userProfileVisible = false;
    }


    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }

    get user(): User|null{
        return this.$store.getters['user/user'];
    }
}

</script>

<style lang="sass">

@import './style/bootstrap.min.css'
@import './style/variables'
@import './style/main'

#app
    position: relative
    font-family: "Avenir", Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

#main
    margin: 2rem 0
    padding-top: $banner-height
    width: 100%
    z-index: 0

    transition: width .2s ease-in-out, margin .2s ease-in-out
    
    &.compact
        width: calc(100% - #{$nav-width})
        margin: 2rem 0 2rem $nav-width

.profile
    position: fixed
    width: 500px
    max-width: 90%
    right: 5px
    top: $banner-height + 5px
    z-index: 10

.profile-bg
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, .5)

.nav
    z-index: 1
    position: fixed
    height: 100%
    width: $nav-width
    padding-top: $banner-height
    background-color: $gray
    color: white

    left: 0
    top: 0

    transition: all .2s ease-in-out

    &.hidden
        left: -$nav-width
</style>
