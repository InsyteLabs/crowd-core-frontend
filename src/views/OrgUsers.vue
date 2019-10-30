<template>
    <div class="users container-fluid">
        <div class="card p-3">
            <div class="row">
                <div class="col-md-8">
                    <h2>Users</h2>
                </div>
                <div class="col-md-4">
                    <button @click="onAddUserClick()" class="btn btn-sm btn-primary float-right mb-1" :disabled="!client">Create User</button>
                    <div class="form-group">
                        <input v-model="filter" type="text" class="form-control form-control-sm" placeholder="Filter users">
                    </div>
                </div>
            </div>
            <UserList
                :users="users"

                @editUser="onEditUserClick($event)"
                @deleteUser="onDeleteUserClick($event)">
            </UserList>
        </div>
        <ModalWindow @modalActiveStateChange="onModalActiveStateChange($event)" ref="userModal">
            <UserForm
                ref="userForm"
                :user="selectedUser"
                :newUser="newUser"
                :roles="roles"

                @createUser="onCreateUser($event)"
                @updateUser="onUpdateUser($event)">
            </UserForm>
        </ModalWindow>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Ref } from 'vue-property-decorator';

import { escapeRegex }    from '@/utilities';
import { userService }    from '@/services';
import { User }           from '@/models';
import { IRole, IClient } from '@/interfaces';
import UserList           from '@/components/user/UserList.vue';
import UserForm           from '@/components/user/UserForm.vue';
import ModalWindow        from '@/components/ModalWindow.vue';

@Component({
    components: {
        UserList,
        UserForm,
        ModalWindow
    }
})
export default class OrgUsers extends Vue {
    @Ref('userModal') userModal!: ModalWindow;
    @Ref('userForm')  userForm!:  UserForm;

    selectedUser: User|null = null;
    newUser:      boolean   = false;
    roles:        IRole[]   = [];
    filter:       string    = '';

    async created(): Promise<void>{
        if(!(this.client && this.user)){
            await this.$store.dispatch('loadUserToken');
        }

        this._loadUsers();
        this._loadRoles();
    }

    onAddUserClick(): void{
        this.newUser      = true;
        this.selectedUser = null;

        this.userForm.clear();
        this.userModal.open();
    }

    onEditUserClick(user: User): void{
        this.newUser      = false;
        this.selectedUser = user;

        this.userForm.init();
        this.userModal.open();
    }

    async onCreateUser(user: User): Promise<void>{
        if(!this.client) return;

        user.clientId = this.client.id;

        const newUser = await userService.createUser(<number>this.client.id, user);

        this.userModal.close();
    }

    async onUpdateUser(user: User): Promise<void>{
        if(!this.client) return;

        user.clientId = this.client.id;

        const updatedUser = await userService.updateUser(<number>this.client.id, user);

        this.userModal.close();
        this.userForm.clear();
    }

    async onDeleteUserClick(user: User): Promise<void>{
        if(!(this.client && this.client.id)) return;

        const deleted = await userService.deleteUser(this.client.id, user);
    }

    onModalActiveStateChange(active: boolean): void{
        
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

    get users(): User[]{
        const users: User[] = this.$store.getters.users;

        if(!this.filter) return users;

        const exp = new RegExp(escapeRegex(this.filter), 'i');
        return users.filter((u: User) => {
            if(exp.test(u.firstName))               return true;
            if(exp.test(u.lastName))                return true;
            if(exp.test(u.email))                   return true;
            if(exp.test(u.username))                return true;
            if(exp.test(<string>u.disabledComment)) return true;

            for(let role of u.roles){
                if(exp.test(`${ role }`)) return true;
            }

            if(exp.test(u.isDisabled ? 'yes' : 'no')) return true;

            return false;
        });
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadUsers(): Promise<void>{
        if(!(this.client && this.client.id)) return;

        this.$store.dispatch('loadUsers', this.client.id);
    }

    private async _loadRoles(): Promise<IRole[]>{
        const roles = await userService.getRoles();

        return this.roles = roles;
    }
}
</script>

<style scoped lang="sass">

</style>