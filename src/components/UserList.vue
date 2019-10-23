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
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop } from 'vue-property-decorator';
import { User } from '@/models';

@Component
export default class UserList extends Vue {
    @Prop() users!: User[];

}
</script>

<style>

</style>