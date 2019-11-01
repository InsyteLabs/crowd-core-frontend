<template>
    <div class="home container-fluid">
        <LoginForm v-if="!user" @login="onLoginClick($event)"></LoginForm>
    </div>
</template>

<script lang="ts">
'use strict';

import { Component, Vue } from 'vue-property-decorator';

import LoginForm from '@/components/LoginForm.vue';

import { userService, clientService } from '@/services';

import { User }                from '../models';
import { IClient, IUserToken } from '../interfaces';

@Component({
    components: {
        LoginForm
    }
})
export default class Home extends Vue {


    async onLoginClick(o: any): Promise<any>{
        let token: IUserToken|void = await userService.authenticate(o.username, o.password);

        if(!token){
            console.error('Incorrect username/password');
            return;
        }

        const user = new User(token.user);
        
        if(user && user.clientId){
            let client: IClient = await clientService.getClient(user.clientId);

            this.$store.dispatch('setClient', client);

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
    get user(): User{
        return this.$store.getters.user;
    }

    get client(): IClient{
        return this.$store.getters.client;
    }
}
</script>
