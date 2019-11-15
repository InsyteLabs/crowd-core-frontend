<template>
    <div id="app">
        <AppMessages ref="messages"></AppMessages>

        <Banner
            @toggleNav="onToggleNav($event);"
            @userClick="onUserClick();">
        </Banner>

        <div class="nav" :class="{ hidden: !navigationVisible }">
            <Navigation :visible="navigationVisible" @close="navigationVisible = false"></Navigation>
        </div>

        <div v-show="userProfileVisible" class="profile">
            <div @click="onUserClick();" class="profile-bg"></div>
            <UserProfile
                @login="onLoginClick()"
                @logout="onLogoutClick()">
            </UserProfile>
        </div>

        <div id="main" :class="{ compact: navigationVisible }">
            <router-view />
        </div>

        <div v-show="showSpinner" id="spinner">
            <HttpSpinner></HttpSpinner>
        </div>

        <div id="socket-status" :class="{ connected: socketConnected }">
            Status: {{
                socketConnected
                    ? 'Connected'
                    : 'Not Conncted'
            }}
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

    navigationVisible:  boolean = window.innerWidth >= 768;
    userProfileVisible: boolean = false;
    lastInterval:       number  = Date.now();
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

    get showSpinner(): boolean{
        return this.$store.getters['pendingHttpCount'] > 0;
    }

    get socketConnected(): boolean{
        return this.$store.getters['ws/connected'];
    }

    
    /*
        =======
        HELPERS
        =======
    */
    heartbeat(): void{
        const now:   number = Date.now(),
              diff:  number = now - this.lastInterval,
              offBy: number = diff - 1000;

        this.lastInterval = now;

        if(offBy > 100){
            this.$store.dispatch('ws/openConnection');

            alert('Page died, re-opning connection');
        }
    }


    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    created(): void{
        window.addEventListener('focus', () => {
            this.$store.dispatch('ws/openConnection');
        });

        setInterval(this.heartbeat, 1000);
    }

}

</script>

<style lang="sass">

@import './style/bootstrap.min.css'
@import './style/variables'
@import './style/main'

#app
    width: 100%
    max-width: 100%
    position: relative
    font-family: "Avenir", Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

#main
    padding-top: 0
    padding-bottom: calc(1rem + #{ $banner-height })
    padding-top: 1rem
    width: 100%
    z-index: 0

    transition: width .2s ease-in-out, margin .2s ease-in-out

    &.compact
        width: 100%

    @media screen and (min-width: 768px)
        padding-top: calc(1rem + #{ $banner-height })
        padding-bottom: 1rem

        &.compact
            width: calc(100% - #{$nav-width})
            margin: 0 0 0 $nav-width

.nav
    z-index: 1
    position: fixed
    height: 100%
    width: 100%
    padding-top: 30%
    text-align: center
    background-color: $gray
    color: white

    left: 0
    top: 0

    transition: all .2s ease-in-out

    &.hidden
        left: -100%

    @media screen and (min-width: 768px)
        width: $nav-width
        text-align: left
        padding-top: $banner-height

        &.hidden
            left: -$nav-width


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

#spinner
    z-index: 1000
    position: fixed
    background-color: rgba($dark-gray, .75)
    width: 45px
    height: 45px
    bottom: $banner-height + 10px
    right: 10px
    border-radius: 3px

    @media screen and (min-width: 768px)
        bottom: 10px
        width: 60px
        height: 60px

#socket-status
    position: fixed
    z-index: 1000
    cursor: default
    padding: 3px 5px
    font-size: .7rem
    border-radius: 3px
    bottom: 0
    left: 50%
    transform: translateX(-50%)
    color: white
    background-color: red

    &.connected
        background-color: green

    @media screen and (min-width: 768px)
        font-size: .8rem
</style>
