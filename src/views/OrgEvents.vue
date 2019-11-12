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
                        <th class="text-center">Manage</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody v-if="events && events.length">
                    <tr v-for="event of events" :key="event.id">
                        <td>{{ event.title }}</td>
                        <td>{{ event.slug }}</td>
                        <td>{{ event.description | truncate(65) }}</td>
                        <td>{{ event.startTime | dateTime }}</td>
                        <td>{{ event.endTime | dateTime }}</td>
                        <td>
                            {{
                                event.active
                                    ? 'Yes'
                                    : 'No'
                            }}
                        </td>
                        <td class="no-wrap text-center">
                            <EditButton @click="onEditEventClick(event)"></EditButton>
                            <DeleteButton @click="onDeleteEventClick(event)"></DeleteButton>
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

import { escapeRegex }                 from '@/utilities';
import { eventService, clientService } from '@/services';
import { IClient }                     from '@/interfaces';
import { User, ClientEvent }           from '@/models';

import ModalWindow from '@/components/ui/ModalWindow.vue';
import EventForm   from '@/components/event/EventForm.vue';

@Component({
    components: {
        ModalWindow,
        EventForm
    }
})
export default class OrgEvents extends Vue {
    @Ref('eventModal') eventModal!: ModalWindow;
    @Ref('eventForm')  eventForm!:  EventForm;

    selectedEvent: ClientEvent|null = null;
    newEvent:      boolean          = true;
    filter:        string           = '';

    onCreateEventClick(): void{
        this.newEvent      = true;
        this.selectedEvent = null;

        this.eventForm.clear();
        this.eventModal.open();
    }

    onEditEventClick(event: ClientEvent): void{
        this.newEvent      = false;
        this.selectedEvent = event;

        this.eventForm.clear();
        this.eventModal.open();
    }

    async onDeleteEventClick(event: ClientEvent): Promise<void>{
        if(!this.client) return;

        const res = await eventService.deleteEvent(<number>this.client.id, event);
    }

    async onCreateEvent(event: ClientEvent): Promise<void>{
        if(!this.client) return;

        const newEvent = await eventService.createEvent(<number>this.client.id, event);

        this.eventModal.close();
    }

    async onUpdateEvent(event: ClientEvent): Promise<void>{
        if(!this.client) return;

        const updatedEvent = await eventService.updateEvent(<number>this.client.id, event);

        this.eventModal.close();
    }


    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters['user/user'];
    }

    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }

    get events(): ClientEvent[]{
        const events: ClientEvent[] = this.$store.getters['event/events'];

        if(!this.filter) return events;

        const exp = new RegExp(escapeRegex(this.filter), 'i');
        return events.filter((e: ClientEvent) => {
            if(exp.test(e.title))       return true;
            if(exp.test(e.slug))        return true;
            if(exp.test(e.description)) return true;

            if(exp.test(e.active ? 'yes' : 'no')) return true;

            return false;
        });
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
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    async created(): Promise<void>{
        await this._loadEvents();
    }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    async _loadEvents(): Promise<void>{
        if(!this.client) return;

        this.$store.dispatch('event/loadEvents', this.client.id);
    }
}
</script>

<style scoped lang="sass">

</style>