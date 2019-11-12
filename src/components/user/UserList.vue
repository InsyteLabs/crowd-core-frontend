<template>
    <div class="user-list container-fluid">
        <table class="table table-sm table-striped">
            <thead>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Roles</th>
                <th>Disabled</th>
                <th>Disabled Comment</th>
                <th class="text-center">Manage</th>
            </thead>
            <tbody v-if="users">
                <tr v-for="user of users" :key="user.id">
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.roles.join(', ') }}</td>
                    <td>
                        {{
                            user.isDisabled
                                ? 'Yes'
                                : 'No'
                        }}
                    </td>
                    <td>{{ user.disabledComment }}</td>
                    <td class="text-center">
                        <EditButton @click="editUser(user)"></EditButton>
                        <DeleteButton @click="deleteUser(user)"></DeleteButton>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { User } from '@/models';

@Component
export default class UserList extends Vue {
    @Prop() users!: User[];

    
    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('deleteUser')
    deleteUser(user: User): void{ }

    @Emit('editUser')
    editUser(user: User): void{ }

}
</script>

<style>

</style>