<template>
    <div class="org-home container-fluid">
        <div v-if="client && client.id">
            <h1 class="text-center">{{ client.name }}</h1>
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
        const client = await clientService.getClientBySlug(this.$route.params.slug);

        return this.client = client;
    }
}
</script>

<style scoped lang="sass">

</style>