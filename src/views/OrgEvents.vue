<template>
    <div class="org-events container-fluid">
        <h3>Events</h3>
        <div v-if="events">
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
                <tbody v-if="events.length">
                    <tr v-for="event of events" :key="event.id">
                        <td>{{ event.title }}</td>
                        <td>{{ event.slug }}</td>
                        <td>{{ event.description }}</td>
                        <td>{{ formatDate(event.startTime) }}</td>
                        <td>{{ formatDate(event.endTime) }}</td>
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
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';

import { eventService, clientService } from '@/services';
import { IEvent, IClient }             from '@/interfaces';

@Component
export default class OrgEvents extends Vue {

    client: IClient|null = null;
    events: IEvent[]     = [];

    created(){
        this._loadClient();
    }

    formatDate(date: Date|string): string{
        const d = new Date(date);

        if(d.toString() === 'Invalid Date'){
            return '';
        }

        const year  = d.getFullYear(),
              month = `${ d.getMonth() + 1 }`,
              day   = `${ d.getDate() }`,
              hour  = `${ d.getHours() }`,
              min   = `${ d.getMinutes() }`,
              sec   = `${ d.getSeconds() }`;

        return `${ year }/${ month.padStart(2, '0') }/${ day.padStart(2, '0') } ${ hour.padStart(2, '0') }:${ min.padStart(2, '0') }:${ sec.padStart(2, '0') }`;
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