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

    client: IClient|null = null;

    async created(): Promise<void>{
        this._loadClient();
    }

    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadClient(): Promise<IClient>{
        const client = await clientService.getClientBySlug(this.$route.params.orgSlug);

        return this.client = client;
    }
}
</script>

<style scoped lang="sass">

</style>