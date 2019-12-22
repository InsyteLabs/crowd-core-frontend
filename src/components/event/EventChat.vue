<template>
    <div class="event-chat container-fluid p-0">
        <div class="card p-3 messages">
            <h4>Event Chat</h4>
            <transition-group v-if="messages && messages.length" name="messages" tag="ul">
                <li v-for="message of messages" :key="message.id">
                    <Message
                        :message="message"
                        
                        @editMessage="editMessageClick($event)"
                        @deleteMessage="deleteMessageClick($event)">
                    </Message>
                </li>
            </transition-group>
            <div class="form-group mb-0">
                <textarea v-model="newMessage" rows="3" class="form-control form-control-sm mb-1" placeholder="Add Message" :disabled="isLocked"></textarea>
                <button @click="addMessageClick()" class="btn btn-sm btn-primary" :disabled="isLocked">Add Message</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import { eventService }           from '@/services';
import { ClientEvent, User }      from '@/models';
import { IEventMessage, IClient } from '@/interfaces';

import Message from '@/components/event/Message.vue';

@Component({
    components: {
        Message
    }
})
export default class EventChat extends Vue {

    // Message fields
    newMessage: string = '';

    /*
        ============
        CHAT METHODS
        ============
    */
    async addMessageClick(): Promise<void>{
        if(!(this.event && this.event.id))   return;
        if(this.isLocked)                    return;
        if(!(this.user && this.user.id))     return;
        if(!(this.client && this.client.id)) return;
        if(!this.newMessage)                 return;

        const message: IEventMessage = {
            eventId: <number>this.event.id,
            userId:  <number>this.user.id,
            text:    this.newMessage,
            hidden:  false
        }

        await eventService.addMessage(<number>this.event.id, message);

        this.newMessage = '';
    }

    async editMessageClick(message: IEventMessage): Promise<void>{
        if(this.isLocked)                return;
        if(!(this.event && this.client)) return;
        
        await eventService.updateMessage(<number>this.event.id, message);
    }

    async deleteMessageClick(message: IEventMessage): Promise<void>{
        if(this.isLocked)                return;
        if(!(this.client && this.event)) return;

        await eventService.deleteMessage(
            <number>this.event.id,
            <number>message.id
        );
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

    get event(): ClientEvent|null{
        return this.$store.getters['event/event'];
    }

    get messages(): IEventMessage[]{
        if(!this.event) return [];

        return this.event.messages || [];
    }

    get isLocked(): boolean{
        if(!this.event)          return false;
        if(!this.event.settings) return false;

        return !!this.event.settings.isLocked;
    }
}
</script>

<style scoped lang="sass">


.messages
    ul
        list-style-type: none
        margin: 0
        padding: 0

        li
            margin: 0 0 1rem
            padding: 0
            background-color: #F8F8F8
            border: 1px solid rgba(0, 0, 0, .05)

.messages-move
    transition: transform .75s
</style>