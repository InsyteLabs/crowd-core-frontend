<template>
    <div class="user-list container-fluid">
        <div class="table-responsive">
            <table class="table table-sm table-striped">
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Roles</th>
                    <th>Disabled</th>
                    <th class="text-center">Manage</th>
                </thead>
                <tbody v-if="users">
                    <tr v-for="user of users" :key="user.id">
                        <td>{{ user.firstName }} {{ user.lastName }}</td>
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
                        <td class="no-wrap text-center">
                            <EditButton @click="editUser(user)"></EditButton>
                            <DeleteButton @click="deleteUser(user)"></DeleteButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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

<style scoped lang="sass">

.table-responsive
    min-width: 100%

</style>