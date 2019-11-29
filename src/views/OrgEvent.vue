<template>
    <div class="org-event container-fluid">
        <div v-if="event">
            <div v-if="isLocked" class="card p-3 mb-3">
                <h3 class="mb-4"><b><u>WARNING:</u></b> This Event Has Been Locked</h3>
                <h5>You may view details about the event but you may not post new questions or chat messages</h5>
            </div>
            <hr v-if="isLocked">
            
            <div v-if="showPasswordForm">
                <EventPasswordForm></EventPasswordForm>
            </div>
            <div v-else>
                <div class="card p-3 mb-3">
                    <h3>{{ event.title }}</h3>
                    <p class="mb-0">{{ event.description }}</p>
                </div>
                <div class="row">
                    <div class="col-md-7 mb-3">
                        <EventQuestions></EventQuestions>
                    </div>
                    <div class="col-md-5 mb-3">
                        <EventChat v-if="showChat"></EventChat>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Watch }  from 'vue-property-decorator';

import { User, ClientEvent } from '@/models';
import { IClient }           from '@/interfaces';

import EventQuestions    from '@/components/event/EventQuestions.vue';
import EventChat         from '@/components/event/EventChat.vue';
import EventPasswordForm from '@/components/event/EventPasswordForm.vue';

@Component({
    components: {
        EventQuestions,
        EventChat,
        EventPasswordForm
    }
})
export default class OrgEvent extends Vue {


    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }

    get event(): ClientEvent|null{
        return this.$store.getters['event/event'];
    }

    get submittedPass(): string{
        return this.$store.getters['event/submittedPass'];
    }

    get showPasswordForm(): boolean{
        if(!this.event) return false;

        const event: ClientEvent|null = this.event;

        if(!event.settings)                 return false;
        if(!event.settings.requirePassword) return false;

        const password = event.settings.password;

        return password !== this.submittedPass;
    }

    get showChat(): boolean{
        if(!this.event) return false;

        const event: ClientEvent|null = this.event;

        if(!event.settings)            return false;
        if(!event.settings.enableChat) return false;

        return true;
    }

    get isLocked(): boolean{
        if(!this.event)          return false;
        if(!this.event.settings) return false;

        return !!this.event.settings.isLocked;
    }


    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    async created(): Promise<void>{
        await this._loadEvent();
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private async _loadEvent(): Promise<void>{
        if(!(this.client && this.client.id)) return;

        await this.$store.dispatch('event/loadEvent', {
            clientId:  this.client.id,
            eventSlug: this.$route.params.eventSlug
        });
    }
}
</script>

<style scoped lang="sass">

</style>