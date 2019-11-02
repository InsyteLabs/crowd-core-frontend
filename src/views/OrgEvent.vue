<template>
    <div class="org-event container-fluid">
        <div v-if="event" class="card p-3">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center">{{ event.title }}</h2>
                    <hr>
                </div>
                <div v-if="!(isAskQuestion || isEditQuestion)" class="col-md-7">
                    <div class="row mb-1">
                        <div class="col">
                            <h4>Q&amp;A</h4>
                        </div>
                        <div class="col">
                            <button @click="askQuestionClick()" class="btn btn-primary float-right">Ask Question</button>
                        </div>
                    </div>
                    <ul v-if="event.questions && event.questions.length" class="questions">
                        <li v-for="question of event.questions" :key="question.id">
                            <Question
                                :question="question"
                                
                                @editQuestion="onEditQuestionClick($event)"
                                @deleteQuestion="onDeleteQuestionClick($event)"
                                @upvote="onUpvoteQuestionClick($event)"
                                @downvote="onDownvoteQuestionClick($event)">
                            </Question>
                        </li>
                    </ul>
                </div>
                <div v-else class="col-md-7">
                    <div class="form-group">
                        <label for="question">Your Question</label>
                        <div class="input-group">
                            <textarea v-model="question" rows="4" class="form-control" placeholder="Question text"></textarea>
                        </div>
                    </div>
                    <button @click="saveQuestionClick()" class="btn btn-primary mr-1">Save</button>
                    <button @click="cancelQuestionClick()" class="btn btn-danger">Cancel</button>
                </div>

                <div class="col-md-5">
                    <h4>Chat</h4>
                    <ul v-if="event.messages && event.messages.length" class="messages">
                        <li v-for="message of event.messages" :key="message.id">
                            <Message
                                :message="message"
                                
                                @editMessage="editMessageClick($event)"
                                @deleteMessage="deleteMessageClick($event)">
                            </Message>
                        </li>
                    </ul>
                    <div class="form-group">
                        <textarea v-model="newMessage" rows="3" class="form-control form-control-sm mb-1" placeholder="Add Message"></textarea>
                        <button @click="addMessageClick()" class="btn btn-sm btn-primary float-right">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Watch }  from 'vue-property-decorator';

import Question from '@/components/event/question/Question.vue';
import Message  from '@/components/event/message/Message.vue';

import { eventService }      from '@/services';
import { User, ClientEvent } from '@/models';
import { AppMessageType }    from '@/constants';

import {
    IClient, IEventQuestion, IEventQuestionStats, IEventMessage, IAppMessage
} from '../interfaces';

@Component({
    components: {
        Question,
        Message
    }
})
export default class OrgEvent extends Vue {

    selectedQuestion: IEventQuestion|null = null;
    isAskQuestion:    boolean             = false;
    isEditQuestion:   boolean             = false;
    question:         string              = '';

    newMessage: string = '';

    async created(): Promise<void>{
        if(this.client) await this._loadEvent();
    }

    
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
    
            if(newQuestion && newQuestion.id){
                // this.event.questions.push(newQuestion);
    
                this.cancelQuestionClick();
            }
        }
        else{
            if(!this.selectedQuestion) return;

            question.id = this.selectedQuestion.id;

            let updatedQuestion = await eventService.updateEventQuestion(this.client.id, question);

            const idx = this.event.questions.findIndex(i => i.id === updatedQuestion.id);

            if(~idx){
                // this.event.questions.splice(idx, 1, updatedQuestion);

                this.selectedQuestion = null;
                this.cancelQuestionClick();
            }
        }
    }

    cancelQuestionClick(): void{
        this.question       = '';
        this.isAskQuestion  = false;
        this.isEditQuestion = false;
    }

    onEditQuestionClick(question: IEventQuestion): void{
        this.selectedQuestion = question;
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
        if(!(this.client && this.client.id)) return;

        const updatedQuestion = await eventService.createQuestionVote(this.client.id, <number>this.event.id, questionId, <number>this.user.id, val);
    }


    /*
        ============
        CHAT METHODS
        ============
    */
    async addMessageClick(): Promise<void>{
        if(!(this.event && this.user)) return;
        if(!this.newMessage)           return;

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
    get client(): IClient{
        return this.$store.getters.client;
    }

    get user(): User{
        return this.$store.getters.user;
    }

    get event(): ClientEvent{
        return this.$store.getters.event;
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
        PRIVATE METHODS
        ===============
    */
    private async _loadEvent(): Promise<void>{
        await this.$store.dispatch('loadEvent', {
            clientId: this.client.id,
            eventSlug: this.$route.params.eventSlug
        });
    }
}
</script>

<style scoped lang="sass">

.questions,
.messages
    list-style-type: none
    margin: 0
    padding: 0

    li
        margin: 0
        padding: 0

</style>