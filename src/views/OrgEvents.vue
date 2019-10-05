<template>
    <div class="org-events container-fluid">
        <div class="card p-3">
            <div class="row">
                <div class="col-md-8">
                    <h3>Events</h3>
                </div>
                <div class="col-md-4">
                    <button @click="onCreateEventClick()" class="btn btn-sm btn-primary float-right mb-1">Create Event</button>
                    <div class="form-group">
                        <input v-model="filter" type="text" class="form-control form-control-sm" placeholder="Filter Events">
                    </div>
                </div>
            </div>
            <table class="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Active</th>
                        <th># Questions</th>
                    </tr>
                </thead>
                <tbody v-if="events && events.length">
                    <tr v-for="event of events" :key="event.id">
                        <td>{{ event.title }}</td>
                        <td>{{ event.slug }}</td>
                        <td>{{ event.description }}</td>
                        <td>{{ event.startTime | dateTime }}</td>
                        <td>{{ event.endTime | dateTime }}</td>
                        <td>
                            {{
                                event.active
                                    ? 'Yes'
                                    : 'No'
                            }}
                        </td>
                        <td>{{ event.questions.length || 0 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ModalWindow @modalActiveStateChange="onModalActiveStateChange($event)" ref="eventModal">
            <EventForm
                :event="selectedEvent"
                :newEvent="newEvent">
            </EventForm>
        </ModalWindow>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Ref } from 'vue-property-decorator';

import ModalWindow from '@/components/ModalWindow.vue';
import EventForm   from '@/components/event/EventForm.vue';

import { eventService, clientService } from '@/services';
import { IEvent, IClient }             from '@/interfaces';

@Component({
    components: {
        ModalWindow,
        EventForm
    }
})
export default class OrgEvents extends Vue {
    @Ref('eventModal') eventModal!: ModalWindow;

    client:        IClient|null = null;
    events:        IEvent[]     = [];
    selectedEvent: IEvent|null  = null;
    newEvent:      boolean      = true;
    filter:        string       = '';

    created(){
        this._loadClient();
    }

    onCreateEventClick(): void{

        this.eventModal.open();
    }

    onModalActiveStateChange(active: boolean): void{

    }

    async _loadEvents(): Promise<void>{
        if(this.client && this.client.id){
            let events = await eventService.getEvents(this.client.id);

            this.events = events;
        }
    }

    async _loadClient(): Promise<void>{
        let client = await clientService.getClientBySlug(this.$route.params['slug']);

        if(client){
            this.client = client;

            this._loadEvents();
        }
    }
}
</script>

<style scoped lang="sass">

</style>