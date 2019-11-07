<template>
    <div class="register-user container-fluid">
        <h3>
            {{
                newUser
                    ? 'Create User'
                    : 'Update User'
            }}
        </h3>
        <form @submit.prevent="save()">
            <div class="row mb-3">
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
                            <input v-model="password" type="password" id="password" class="form-control form-control-sm" :disabled="user">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="confirm-password">Confirm</label>
                        <div class="input-group">
                            <input v-model="passwordConfirm" type="password" id="confirm-password" class="form-control form-control-sm" :disabled="user">
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="disabled">Disabled</label>
                        <div class="input-group">
                            <select v-model="disabled" id="disabled" class="form-control form-control-sm">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="form-group">
                        <label for="disabled-comment">Disabled Comment</label>
                        <div class="input-group">
                            <input v-model="disabledComment" type="text" id="disabled-comment" class="form-control form-control-sm">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
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
            </div>

            <button type="submit" role="submit" class="btn btn-primary">
                {{
                    newUser
                        ? 'Create User'
                        : 'Update User'
                }}
            </button>
        </form>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';

import { User }                        from '@/models';
import { IRole, IClient, IAppMessage } from '@/interfaces';
import { AppMessageType }              from '@/constants';

@Component
export default class UserForm extends Vue {

    @Prop() user!:    User;
    @Prop() newUser!: boolean;
    @Prop() roles!:   IRole[];

    // Form fields
    firstName:       string = '';
    lastName:        string = '';
    email:           string = '';
    username:        string = '';
    password:        string = '';
    passwordConfirm: string = '';
    disabled:        string = 'no';
    disabledComment: string = '';

    save(): void{
        if(this.password && this.password !== this.passwordConfirm){
            const errorMessage: IAppMessage = {
                text: 'Passwords do not match',
                type: AppMessageType.ERROR
            }
            this.$store.dispatch('app/addAppMessage', errorMessage);

            return;
        }

        const user: User = {
            clientId:        null,
            firstName:       this.firstName,
            lastName:        this.lastName,
            email:           this.email,
            username:        this.username,
            password:        this.password,
            isDisabled:      this.disabled === 'yes' ? true : false,
            disabledComment: this.disabledComment,

            roles: this.roles.filter(r => r.checked).map(r => <number>r.id)
        }

        if(this.newUser){
            this.createUser(user);
        }
        else{
            user.id = this.user.id;

            this.updateUser(user);
        }
    }

    clear(): void{
        this._clearForm();
    }

    init(): void{
        this._initForm();
    }


    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }

    get currentUser(): User|null{
        return this.$store.getters['user/user'];
    }


    /*
        ========
        WATCHERS
        ========
    */
    @Watch('user')
    userWatcher(user: User): void{
        if(user) this._initForm();
    }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('createUser')
    createUser(user: User): void{ }

    @Emit('updateUser')
    updateUser(user: User): void{ }


    /*
        ===============
        PRIVATE METHDOS
        ===============
    */
    private _initForm(): void{
        if(!this.user) return;

        this.firstName       = this.user.firstName;
        this.lastName        = this.user.lastName;
        this.email           = this.user.email;
        this.username        = this.user.username;
        this.disabled        = this.user.isDisabled ? 'yes' : 'no';
        this.disabledComment = this.user.disabledComment || '';

        this.roles.forEach(role => {
            role.checked = this.user.roles.includes(role.name);
        });
    }

    private _clearForm(): void{
        this.firstName       = '';
        this.lastName        = '';
        this.email           = '';
        this.username        = '';
        this.password        = '';
        this.passwordConfirm = '';
        this.disabled        = 'no';
        this.disabledComment = '';

        if(Array.isArray(this.roles)){
            this.roles.forEach(role => role.checked = false);
        }
    }

}
</script>

<style scoped lang="sass">

</style>