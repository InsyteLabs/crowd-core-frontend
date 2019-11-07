<template>
    <div class="org-home container-fluid">
        <div v-if="client && client.id">
            <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Owner ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Client Types</th>
                        <th>Disabled</th>
                        <th>Disabled Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ client.id }}</td>
                        <td>{{ client.ownerId }}</td>
                        <td>{{ client.name }}</td>
                        <td>{{ client.slug }}</td>
                        <td>{{ client.types.join(', ') }}</td>
                        <td>
                            {{
                                client.disabled
                                    ? 'Yes'
                                    : 'No'
                            }}
                        </td>
                        <td>{{ client.disabledComment }}</td>
                    </tr>
                </tbody>
            </table>
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