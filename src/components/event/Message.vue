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
                    <button @click="onCancelEditClick()" class="btn btn-sm">Cancel</button>
                </div>
            </div>
            <div v-else class="col-12">
                <div v-if="user && (message.user.id === user.id) && !isLocked" class="text-right">
                    <EditButton @click="onEditMessageClick(message)" ></EditButton>
                    <DeleteButton @click="deleteMessage(message)"></DeleteButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import { User, ClientEvent }          from '@/models';
import { IEventMessage } from '@/interfaces';

@Component
export default class Message extends Vue {
    @Prop() message!: IEventMessage;

    isEditMessage: boolean = false;
    messageText:   string  = '';


    onEditMessageClick(): void{
        if(this.isLocked) return;

        this.messageText = this.message.text;
        this.isEditMessage = true;
    }

    onSaveMessageClick(): void{
        if(this.isLocked) return;

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

    get isLocked(): boolean{
        const event: ClientEvent|null = this.$store.getters['event/event'];

        if(!event)          return false;
        if(!event.settings) return false;

        return !!event.settings.isLocked;
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