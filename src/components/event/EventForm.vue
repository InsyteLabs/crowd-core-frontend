<template>
    <div class="event-form container-fluid">
        <h3>
            {{
                newEvent
                    ? 'Create Event'
                    : 'Update Event'
            }}
        </h3>
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="title">Title</label>
                    <div class="input-group">
                        <input v-model="title" type="text" id="title" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="slug">Slug</label>
                    <div class="input-group">
                        <input v-model="slug" type="text" id="slug" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="start-time">Start Time</label>
                    <div class="input-group">
                        <input v-model="start" type="text" id="start-time" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="end-time">End Time</label>
                    <div class="input-group">
                        <input v-model="end" type="text" id="end-time" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="description">Description</label>
                    <div class="input-group">
                        <textarea v-model="description" id="description" rows="4" class="form-control"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <h4>Event Settings</h4>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="event-password">Password</label>
                    <div class="input-group">
                        <input v-model="password" type="text" id="event-password" class="form-control">
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-4">
                <label>
                    <input v-model="locked" type="checkbox"> Locked
                </label>
            </div>
            <div class="col-md-4">
                <label>
                    <input v-model="requirePassword" type="checkbox"> Require Password
                </label>
            </div>
            <div class="col-md-4">
                <label>
                    <input v-model="requireLogin" type="checkbox"> Require Login
                </label>
            </div>
            <div class="col-md-4">
                <label>
                    <input v-model="enableChat" type="checkbox"> Enable Chat
                </label>
            </div>
        </div>
        <button @click="save()" class="btn btn-primary">
            {{
                newEvent
                    ? 'Create Event'
                    : 'Update Event'
            }}
        </button>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';

import { IAppMessage }             from '@/interfaces';
import { AppMessageType }          from '@/constants';

import { ClientEvent }             from '@/models';
import { IClient, IEventSettings } from '@/interfaces';
import { dateTimeFilter }          from '@/filters/date-time';

@Component
export default class EventForm extends Vue {
    @Prop() event!:    ClientEvent;
    @Prop() newEvent!: boolean;

    title:           string = '';
    slug:            string = '';
    start:           string = '';
    end:             string = '';
    description:     string = '';
    password:        string = '';
    locked:          boolean = false;
    requirePassword: boolean = false;
    requireLogin:    boolean = false;
    enableChat:      boolean = false;

    save(): void{
        if(!(this.client && this.client.id)){
            const errorMessage: IAppMessage = {
                text: 'Cannot save event, client not found',
                type: AppMessageType.ERROR
            }
            this.$store.dispatch('app/addAppMessage', errorMessage);

            return;
        }

        const event: ClientEvent = {
            clientId:    this.client.id,
            title:       this.title,
            slug:        this.slug,
            description: this.description,
            startTime:   new Date(this.start),
            endTime:     new Date(this.end),

            questions: [],
            messages:  [],

            settings: <IEventSettings>{
                password:        this.password,
                isLocked:        this.locked,
                requirePassword: this.requirePassword,
                requireLogin:    this.requireLogin,
                enableChat:      this.enableChat
            }
        }

        if(this.newEvent){
            this.createEvent(event);
        }
        else{
            event.id = this.event.id;
    
            this.updateEvent(event);
        }
    }

    clear(): void{
        this._clearForm();
    }


    /*
        =======
        GETTERS
        =======
    */
    get client(): IClient|null{
        return this.$store.getters['client/client'];
    }


    /*
        ========
        WATCHERS
        ========
    */
    @Watch('event')
    eventWatcher(event: ClientEvent): void{
        event ? this._initForm() : this._clearForm();
    }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('createEvent')
    createEvent(event: ClientEvent): void{ }

    @Emit('updateEvent')
    updateEvent(event: ClientEvent): void{ }


    /*
        ===============
        PRIVATE METHODS
        ===============
    */
    private _initForm(): void{
        if(!this.event) return;

        const event    = this.event,
              settings = this.event.settings;

        this.title           = event.title;
        this.slug            = event.slug;
        this.start           = dateTimeFilter(event.startTime);
        this.end             = dateTimeFilter(event.endTime);
        this.description     = event.description;

        if(!settings) return;

        this.password        = settings.password;
        this.requirePassword = settings.requirePassword;
        this.locked          = settings.isLocked;
        this.requireLogin    = settings.requireLogin;
        this.enableChat      = settings.enableChat;
    }

    private _clearForm(): void{
        this.title           = '';
        this.slug            = '';
        this.start           = '';
        this.end             = '';
        this.description     = '';
        this.password        = '';
        this.requirePassword = false;
        this.locked          = false;
        this.requireLogin    = false;
        this.enableChat      = false;
    }
}
</script>

<style scoped lang="sass">

</style>