<template>
    <div class="register-user container-fluid">
        <h3>Create User</h3>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="first-name">First Name</label>
                    <div class="input-group">
                        <input v-model="firstName" type="text" id="first-name" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="last-name">Last Name</label>
                    <div class="input-group">
                        <input v-model="lastName" type="text" id="last-name" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="email">Email</label>
                    <div class="input-group">
                        <input v-model="email" type="text" id="email" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <!-- EMPTY -->
            </div>
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
                        <input v-model="password" type="password" id="password" class="form-control form-control-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h5>Roles</h5>
                <div class="row">
                    <div v-for="role of roles" :key="role.id" class="col-md-6">
                        <label>
                            <input v-model="role.checked" type="checkbox"> {{ role.name }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button @click="saveUser()" class="btn btn-primary">Save User</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { User }  from '@/models';
import { IRole } from '../interfaces';

@Component
export default class RegisterUser extends Vue {

    @Prop() roles!: IRole[];

    // Form fields
    firstName: string = '';
    lastName:  string = '';
    email:     string = '';
    username:  string = '';
    password:  string = '';

    @Emit('saveUser')
    saveUser(): User{
        const user: User = {
            clientId:        null,
            firstName:       this.firstName,
            lastName:        this.lastName,
            email:           this.email,
            username:        this.username,
            password:        this.password,
            isDisabled:      false,
            disabledComment: '',
            roles: this.roles.filter(r => r.checked).map(r => <number>r.id)
        }

        return user;
    }

    clear(): void{
        this.lastName  = '';
        this.email     = '';
        this.username  = '';
        this.password  = '';
        this.firstName = '';

        if(Array.isArray(this.roles)){
            this.roles.forEach(role => role.checked = false);
        }
    }
}
</script>

<style scoped lang="sass">

</style>