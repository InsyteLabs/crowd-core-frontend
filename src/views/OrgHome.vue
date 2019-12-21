<template>
    <div class="org-home container-fluid">
        <div v-if="client && client.id" class="row">
            <div class="col-md-6">
                <div class="card p-3 mb-3">
                    <h3>Account Info</h3>
                    <table class="table table-sm table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Account Type</th>
                                <th>Account Name</th>
                                <th>Slug</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Status Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ client.type.name }}</td>
                                <td>{{ client.name }}</td>
                                <td>{{ client.slug }}</td>
                                <td>{{ client.owner ? client.owner.firstName + ' ' + client.owner.lastName : '' }}</td>
                                <td>
                                    {{
                                        client.disabled
                                            ? 'Inactive'
                                            : 'Active'
                                    }}
                                </td>
                                <td>{{ client.disabledComment }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card p-3">
                    <h3>Account Limits / Usage</h3>
                    <hr>
                    <h5>Events</h5>
                    <table class="table table-sm table-striped table-bordered mb-4">
                        <thead>
                            <tr>
                                <th>Event Limit</th>
                                <th>Event Viewer Limit</th>
                                <th>Events Created</th>
                                <th>Active Events</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ client.type.maxEvents }}</td>
                                <td>{{ client.type.maxEventViewers }}</td>
                                <td>
                                    <span v-if="client.usage">{{ client.usage.totalEvents }}</span>
                                </td>
                                <td>{{ client.usage.activeEvents }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h5>Users</h5>
                    <table class="table table-sm table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Registered Users</th>
                                <th>Anonymous Users</th>
                                <th>Total Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ client.usage.userCount }}</td>
                                <td>{{ client.usage.anonymousUserCount }}</td>
                                <td>{{ client.usage.totalUsers }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';

import { clientService } from '@/services';
import { IClient }       from '@/interfaces';

@Component
export default class OrgHome extends Vue {

    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient|null{
        return this.$store.getters['client/client']
    }

    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    async created(): Promise<void>{
        if(!(this.client && this.client.id)) await this._loadClient();
    }

    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadClient(): Promise<void>{
        const slug: string = this.$route.params.slug;

        await this.$store.dispatch('client/loadClientBySlug', slug);
    }
}
</script>

<style scoped lang="sass">

</style>