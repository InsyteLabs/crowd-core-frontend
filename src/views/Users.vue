<template>
    <div class="users container-fluid">
        <div class="card p-3">
            <div class="row">
                <div class="col-md-8">
                    <h2>Users</h2>
                </div>
                <div class="col-md-4">
                    <button @click="onAddUserClick()" class="btn btn-sm btn-primary float-right mb-1">Create User</button>
                    <div class="form-group">
                        <input v-model="filter" type="text" class="form-control form-control-sm" placeholder="Filter users">
                    </div>
                </div>
            </div>
            <UserList
                :users="users">
            </UserList>
        </div>
        <ModalWindow @modalActiveStateChange="onModalActiveStateChange($event)" ref="registerUserModal">
            <RegisterUser
                ref="userForm"
                :roles="roles"
                @saveUser="onSaveUser($event)">
            </RegisterUser>
        </ModalWindow>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Ref } from 'vue-property-decorator';

import { userService } from '@/services';
import { User }        from '@/models';
import { IRole }       from '@/interfaces';
import UserList        from '@/components/UserList.vue';
import RegisterUser    from '@/components/RegisterUser.vue';
import ModalWindow     from '@/components/ModalWindow.vue';

@Component({
    components: {
        UserList,
        RegisterUser,
        ModalWindow
    }
})
export default class Users extends Vue {
    @Ref('registerUserModal') registerUserModal!: ModalWindow;
    @Ref('userForm')          userForm!:          RegisterUser;

    users:  User[]  = [];
    roles:  IRole[] = [];
    filter: string  = '';

    async created(){
        this._loadUsers();
        this._loadRoles();
    }

    onAddUserClick(): void{
        this.userForm.clear();
        this.registerUserModal.open();
    }

    onSaveUser(user: User): void{
        userService.createUser(user).then((newUser: User) => {
            this.users.push(newUser);
            this.registerUserModal.close();
        });
    }

    onModalActiveStateChange(active: boolean): void{
        
    }

    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadUsers(): Promise<User[]>{
        const users = await userService.getUsers();

        return this.users = users;
    }

    private async _loadRoles(): Promise<IRole[]>{
        const roles = await userService.getRoles();

        return this.roles = roles;
    }
}
</script>

<style scoped lang="sass">

</style>