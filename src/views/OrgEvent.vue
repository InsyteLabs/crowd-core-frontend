<template>
    <div class="org-event container-fluid">
        <div v-if="event">
            <div v-if="(event.settings && event.settings.requirePassword) && submittedPass !== event.settings.password">
                <EventPasswordForm></EventPasswordForm>
            </div>
            <div v-else>
                <div class="card p-3 mb-3">
                    <h3>{{ event.title }}</h3>
                    <p class="mb-0">{{ event.description }}</p>
                </div>
                <div class="row">
                    <div class="col-md-7 mb-3">
                        <div class="card p-3">
                            <div class="questions">
                                <h4>Question &amp; Answer</h4>
                                <transition-group v-if="event.questions && event.questions.length" name="questions" tag="ul">
                                    <li v-for="question of event.questions" :key="question.id">
                                        <Question
                                            :question="question"
                                            
                                            @editQuestion="onEditQuestionClick($event)"
                                            @deleteQuestion="onDeleteQuestionClick($event)"
                                            @upvote="onUpvoteQuestionClick($event)"
                                            @downvote="onDownvoteQuestionClick($event)">
                                        </Question>
                                    </li>
                                </transition-group>
                            </div>
                            <div>
                                <div class="form-group mb-0">
                                    <label for="question">Your Question</label>
                                    <textarea v-model="question" rows="3" class="form-control form-control-sm mb-1" placeholder="Question text"></textarea>
                                    <button @click="saveQuestionClick()" class="btn btn-sm btn-primary mr-1">Ask Question</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 mb-3">
                        <div class="card p-3 messages">
                            <h4>Event Chat</h4>
                            <transition-group v-if="event.messages && event.messages.length" name="messages" tag="ul">
                                <li v-for="message of event.messages" :key="message.id">
                                    <Message
                                        :message="message"
                                        
                                        @editMessage="editMessageClick($event)"
                                        @deleteMessage="deleteMessageClick($event)">
                                    </Message>
                                </li>
                            </transition-group>
                            <div class="form-group mb-0">
                                <textarea v-model="newMessage" rows="3" class="form-control form-control-sm mb-1" placeholder="Add Message"></textarea>
                                <button @click="addMessageClick()" class="btn btn-sm btn-primary">Add Message</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Watch }  from 'vue-property-decorator';

import { eventService }      from '@/services';
import { User, ClientEvent } from '@/models';
import { AppMessageType }    from '@/constants';

import {
    IClient, IEventQuestion, IEventQuestionStats, IEventMessage, IAppMessage
} from '../interfaces';

import Question          from '@/components/event/Question.vue';
import Message           from '@/components/event/Message.vue';
import EventPasswordForm from '@/components/event/EventPasswordForm.vue';

@Component({
    components: {
        Question,
        Message,
        EventPasswordForm
    }
})
export default class OrgEvent extends Vue {

    // Question fields
    selectedQuestion: IEventQuestion|null = null;
    isAskQuestion:    boolean             = true;
    isEditQuestion:   boolean             = false;
    question:         string              = '';

    // Message fields
    newMessage: string = '';

    /*
        ================
        QUESTION METHODS
        ================
    */
    askQuestionClick(): void{
        this.isAskQuestion = true;
    }

    async saveQuestionClick(): Promise<void>{
        if(!(this.user   && this.user.id))   return;
        if(!(this.client && this.client.id)) return;
        if(!(this.event  && this.event.id))  return;

        const question: IEventQuestion = {
            eventId: this.event.id,
            userId:  this.user.id,
            text:    this.question,
            hidden:  false
        }

        if(this.isAskQuestion){
            let newQuestion = await eventService.createEventQuestion(this.client.id, question);
        }
        else{
            if(!this.selectedQuestion) return;

            question.id = this.selectedQuestion.id;

            let updatedQuestion = await eventService.updateEventQuestion(this.client.id, question);

            const idx = this.event.questions.findIndex(i => i.id === updatedQuestion.id);

            if(~idx){
                this.selectedQuestion = null;
            }
        }
        this.question = '';
        this.isAskQuestion = true;
        this.isEditQuestion = false;
    }

    onEditQuestionClick(question: IEventQuestion): void{
        this.selectedQuestion = question;
        this.isAskQuestion    = false;
        this.isEditQuestion   = true;
        this.question         = question.text;
    }

    async onDeleteQuestionClick(question: IEventQuestion): Promise<void>{
        if(!this.event)                      return;
        if(!(this.client && this.client.id)) return;

        const deleted = await eventService.deleteEventQuestion(this.client.id, question);
    }

    async onUpvoteQuestionClick(question: IEventQuestion): Promise<void>{
        this.vote(<number>question.id, 1);
    }

    async onDownvoteQuestionClick(question: IEventQuestion): Promise<void>{
        this.vote(<number>question.id, -1);
    }

    async vote(questionId: number, val: number): Promise<void>{
        if(!this.event)                      return;
        if(!(this.user && this.user.id))     return;
        if(!(this.client && this.client.id)) return;

        const updatedQuestion = await eventService.createQuestionVote(this.client.id, <number>this.event.id, questionId, <number>this.user.id, val);
    }


    /*
        ============
        CHAT METHODS
        ============
    */
    async addMessageClick(): Promise<void>{
        if(!(this.event && this.event.id))   return;
        if(!(this.user && this.user.id))     return;
        if(!(this.client && this.client.id)) return;
        if(!this.newMessage)                 return;

        const message: IEventMessage = {
            eventId: <number>this.event.id,
            userId:  <number>this.user.id,
            text:    this.newMessage,
            hidden:  false
        }

        await eventService.addMessage(<number>this.client.id, <number>this.event.id, message);

        this.newMessage = '';
    }

    async editMessageClick(message: IEventMessage): Promise<void>{
        if(!(this.event && this.client)) return;
        
        await eventService.updateMessage(<number>this.client.id, <number>this.event.id, message);
    }

    async deleteMessageClick(message: IEventMessage): Promise<void>{
        if(!(this.client && this.event)) return;

        await eventService.deleteMessage(
            <number>this.client.id,
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

    get submittedPass(): string{
        return this.$store.getters['event/submittedPass'];
    }


    /*
        ========
        WATCHERS
        ========
    */
    @Watch('client')
    clientWatcher(client: IClient): void{

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

.questions,
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

.questions-move,
.messages-move
    transition: transform .75s
</style>