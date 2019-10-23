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
                    <tr class="no-wrap">
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Active</th>
                        <th># Questions</th>
                        <th>Manage</th>
                        <th>View</th>
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
                        <td class="no-wrap">
                            <button @click="onEditEventClick(event)" class="btn btn-sm btn-warning mr-1">
                                <svg class="btn-icon pencil" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M493.255 56.236l-37.49-37.49c-24.993-24.993-65.515-24.994-90.51 0L12.838 371.162.151 485.346c-1.698 15.286 11.22 28.203 26.504 26.504l114.184-12.687 352.417-352.417c24.992-24.994 24.992-65.517-.001-90.51zm-95.196 140.45L174 420.745V386h-48v-48H91.255l224.059-224.059 82.745 82.745zM126.147 468.598l-58.995 6.555-30.305-30.305 6.555-58.995L63.255 366H98v48h48v34.745l-19.853 19.853zm344.48-344.48l-49.941 49.941-82.745-82.745 49.941-49.941c12.505-12.505 32.748-12.507 45.255 0l37.49 37.49c12.506 12.506 12.507 32.747 0 45.255z"></path>
                                </svg>
                            </button>
                            <button @click="onDeleteEventClick(event)" class="btn btn-sm btn-danger">
                                <svg class="btn-icon delete" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z"></path>
                                </svg>
                            </button>
                        </td>
                        <td>
                            <router-link :to="{ name: 'org-event', params: { slug: client.slug, eventSlug: event.slug } }">
                                <button class="btn btn-sm btn-primary">View</button>
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ModalWindow ref="eventModal">
            <EventForm
                ref="eventForm"
                :event="selectedEvent"
                :newEvent="newEvent"
                
                @createEvent="onCreateEvent($event)"
                @updateEvent="onUpdateEvent($event)">
            </EventForm>
        </ModalWindow>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Ref, Watch } from 'vue-property-decorator';

import ModalWindow from '@/components/ModalWindow.vue';
import EventForm   from '@/components/event/EventForm.vue';

import { eventService, clientService } from '@/services';
import { IEvent, IClient }             from '@/interfaces';
import { User }                        from '@/models';

@Component({
    components: {
        ModalWindow,
        EventForm
    }
})
export default class OrgEvents extends Vue {
    @Ref('eventModal') eventModal!: ModalWindow;
    @Ref('eventForm')  eventForm!:  EventForm;

    events:        IEvent[]     = [];
    selectedEvent: IEvent|null  = null;
    newEvent:      boolean      = true;
    filter:        string       = '';

    async created(): Promise<void>{
        if(!(this.user && this.client)){
            await this.$store.dispatch('loadUserToken');
        }

        if(this.client && this.user){
            this._loadEvents();
        }
    }

    onCreateEventClick(): void{
        this.newEvent      = true;
        this.selectedEvent = null;

        this.eventForm.clear();
        this.eventModal.open();
    }

    onEditEventClick(event: IEvent): void{
        this.newEvent      = false;
        this.selectedEvent = event;

        this.eventForm.clear();
        this.eventModal.open();
    }

    async onDeleteEventClick(event: IEvent): Promise<void>{
        const res = await eventService.deleteEvent(event);

        this._loadEvents();
    }

    async onCreateEvent(event: IEvent): Promise<void>{
        const newEvent = await eventService.createEvent(event);

        await this._loadEvents();

        this.eventModal.close();
    }

    async onUpdateEvent(event: IEvent): Promise<void>{
        const updatedEvent = await eventService.updateEvent(event);

        await this._loadEvents();

        this.eventModal.close();
    }

    /*
        ========
        WATCHERS
        ========
    */
    @Watch('client')
    clientWatcher(client: IClient): void{
        if(client) this._loadEvents();
    }


    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters.user;
    }

    get client(): IClient|null{
        return this.$store.getters.client;
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    async _loadEvents(): Promise<void>{
        if(!this.client) return;

        this.events = await eventService.getEvents(<number>this.client.id);
    }
}
</script>

<style scoped lang="sass">

</style>