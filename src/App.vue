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

import Banner      from '@/components/Banner.vue';
import Navigation  from '@/components/Navigation.vue';
import AppMessages from '@/components/AppMessages.vue';
import UserProfile from '@/components/UserProfile.vue';

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

    navigationVisible: boolean = true;
    userProfileVisible:  boolean = false;
    loggedIn:          boolean = (this.user && this.user.id) ? true : false;

    async created(): Promise<void>{ }

    onToggleNav(){
        this.navigationVisible = !this.navigationVisible;
    }

    onUserClick(){
        this.userProfileVisible = !this.userProfileVisible;
    }

    onLoginClick(): void{
        this.userProfileVisible = false;
        this.$router.push({ name: 'login' });
    }

    async onLogoutClick(): Promise<void>{
        tokenService.deleteToken();

        this.$store.commit('setUser', null);

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

            userToken && this.$store.commit('setUser', userToken.user);
        }

        this.userProfileVisible = false;

        if(this.client){
            const slug: string = this.client.slug;
            this.$router.push({ name: 'org-home', params: { orgSlug: slug } });
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
        width: calc(100% - 250px)
        margin: 2rem 0 2rem 250px

.profile
    width: 500px
    max-width: 90%
    position: absolute
    right: 5px
    top: 85px
    z-index: 10

.nav
    z-index: 1
    position: fixed
    height: 100%
    width: 250px
    padding-top: $banner-height
    background-color: $gray
    color: white

    left: 0
    top: 0

    transition: all .2s ease-in-out

    &.hidden
        left: -250px
</style>
