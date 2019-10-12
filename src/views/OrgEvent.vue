<template>
    <div class="org-event container-fluid">
        <h3>Org Event</h3>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component }  from 'vue-property-decorator';
import { IEvent, IClient } from '../interfaces';
import { eventService } from '../services';

@Component
export default class OrgEvent extends Vue {

    event: IEvent|null = null;

    created(): void{
        this._loadEvent();
    }

    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient{
        return this.$store.getters.client;
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadEvent(): Promise<void>{
        let event = await eventService.getEvent(<number>this.client.id, this.$route.params.eventSlug);

        this.event = event;

        console.log(event);
    }
}
</script>

<style scoped lang="sass">

</style>