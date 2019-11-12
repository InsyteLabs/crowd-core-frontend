<template>
    <div class="home container-fluid">
        <h1>Application Home</h1>
    </div>
</template>

<script lang="ts">
'use strict';

import { Component, Vue } from 'vue-property-decorator';

import { userService, clientService } from '@/services';
import { IClient }                    from '@/interfaces';
import { User }                       from '@/models';

@Component
export default class Home extends Vue {

    onBtnClick(){
        console.log('clicked');
    }

    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters['user/user'];
    }

    get client(): IClient|null{
        return this.$store.getters['user/user'];
    }
}
</script>
