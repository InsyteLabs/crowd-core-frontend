<template>
    <div class="login container-fluid text-white p-3">
        <h3>Login</h3>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="username">Username</label>
                    <div class="input-group">
                        <input v-model="username" type="text" id="username" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-group">
                        <input v-model="password" type="password" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
        </div>
        <button @click="login()" class="btn btn-primary">Login</button>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Emit } from 'vue-property-decorator';

@Component
export default class LoginForm extends Vue {

    username: string = '';
    password: string = '';

    @Emit('login')
    login(){
        return {
            username: this.username,
            password: this.password
        }
    }
}
</script>

<style lang="sass">

@import 'src/style/variables'

.login
    background-color: $gray

</style>