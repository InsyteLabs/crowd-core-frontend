<template>
    <div class="message container-fluid">
        <div class="row">
            <div class="col-12">
                <textarea v-if="isEditMessage" v-model="messageText" class="form-control form-control-sm mb-1" rows="2"></textarea>
                <div v-else>
                    <small>
                        <i>
                            {{
                                message.user.isAnonymous
                                    ? 'Anonymous'
                                    : message.user.username
                            }}:
                        </i>
                    </small>
                    <p class="mb-0">{{ message.text }}</p>
                </div>
            </div>
            <div v-if="isEditMessage" class="col-12">
                <div class="text-left">
                    <button @click="onSaveMessageClick()" class="btn btn-sm btn-primary mr-1">Update</button>
                    <button @click="onCancelEditClick()" class="btn btn-sm btn-danger">Cancel</button>
                </div>
            </div>
            <div v-else class="col-12">
                <div v-if="user && (message.user.id === user.id)" class="text-right">
                    <button @click="onEditMessageClick(message)" class="btn btn-sm btn-warning mr-1">
                        <svg class="btn-icon pencil" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M493.255 56.236l-37.49-37.49c-24.993-24.993-65.515-24.994-90.51 0L12.838 371.162.151 485.346c-1.698 15.286 11.22 28.203 26.504 26.504l114.184-12.687 352.417-352.417c24.992-24.994 24.992-65.517-.001-90.51zm-95.196 140.45L174 420.745V386h-48v-48H91.255l224.059-224.059 82.745 82.745zM126.147 468.598l-58.995 6.555-30.305-30.305 6.555-58.995L63.255 366H98v48h48v34.745l-19.853 19.853zm344.48-344.48l-49.941 49.941-82.745-82.745 49.941-49.941c12.505-12.505 32.748-12.507 45.255 0l37.49 37.49c12.506 12.506 12.507 32.747 0 45.255z"></path>
                        </svg>
                    </button>
                    <button @click="deleteMessage(message);" class="btn btn-sm btn-danger">
                        <svg class="btn-icon delete" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import { User }          from '@/models';
import { IEventMessage } from '@/interfaces';

@Component
export default class Message extends Vue {
    @Prop() message!: IEventMessage;

    isEditMessage: boolean = false;
    messageText:   string  = '';


    onEditMessageClick(): void{
        this.messageText = this.message.text;
        this.isEditMessage = true;
    }

    onSaveMessageClick(): void{
        const message: IEventMessage = {
            id:      this.message.id,
            eventId: this.message.eventId,
            userId:  this.message.userId,
            text:    this.messageText,
            hidden:  this.message.hidden
        }

        this.editMessage(message);

        this.isEditMessage = false;
    }

    onCancelEditClick(): void{
        this.isEditMessage = false;
        this.messageText   = '';
    }


    /*
        =======
        GETTERS
        =======
    */
    get user(): User{
        return this.$store.getters['user/user'];
    }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('editMessage')
    editMessage(message: IEventMessage): void{ }

    @Emit('deleteMessage')
    deleteMessage(message: IEventMessage): void{ }

}
</script>

<style scoped lang="sass">

.message
    padding: .4rem

</style>