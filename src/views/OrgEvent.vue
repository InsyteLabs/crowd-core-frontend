<template>
    <div class="org-event container-fluid">
        <div v-if="event" class="card p-3">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center">{{ event.title }}</h2>
                    <hr>
                </div>
                <div v-if="!(isAskQuestion || isEditQuestion)" class="col-12">
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
                <div v-if="isAskQuestion || isEditQuestion" class="col-12">
                    <div class="form-group">
                        <label for="question">Your Question</label>
                        <div class="input-group">
                            <textarea v-model="question" rows="4" class="form-control" placeholder="Question text"></textarea>
                        </div>
                    </div>
                    <button @click="saveQuestionClick()" class="btn btn-primary mr-1">Save</button>
                    <button @click="cancelQuestionClick()" class="btn btn-danger">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Watch }  from 'vue-property-decorator';

import Question from '@/components/event/question/Question.vue';

import { IEvent, IClient, IEventQuestion, IEventQuestionStats } from '../interfaces';
import { User }                                                 from '../models';
import { eventService }                                         from '../services';

@Component({
    components: {
        Question
    }
})
export default class OrgEvent extends Vue {

    event:            IEvent|null         = null;
    selectedQuestion: IEventQuestion|null = null;
    isAskQuestion:    boolean             = false;
    isEditQuestion:   boolean             = false;
    question:         string              = '';

    async created(): Promise<void>{
        await this.$store.dispatch('loadUserToken');

        this.client && this._loadEvent();
    }

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
            let newQuestion = await eventService.createEventQuestion(question);
    
            if(newQuestion && newQuestion.id){
                this.event.questions.push(newQuestion);
    
                this.cancelQuestionClick();
            }
        }
        else{
            if(!this.selectedQuestion) return;

            question.id = this.selectedQuestion.id;

            let updatedQuestion = await eventService.updateEventQuestion(question);

            const idx = this.event.questions.findIndex(i => i.id === updatedQuestion.id);

            if(~idx){
                this.event.questions.splice(idx, 1, updatedQuestion);

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
        if(!this.event) return;

        const deleted = await eventService.deleteEventQuestion(question);

        if(deleted){
            const idx = this.event.questions.findIndex(i => i.id === question.id);

            if(~idx){
                this.event.questions.splice(idx, 1);
            }
        }
    }

    async onUpvoteQuestionClick(question: IEventQuestion): Promise<void>{
        this.vote(<number>question.id, 1);
    }

    async onDownvoteQuestionClick(question: IEventQuestion): Promise<void>{
        this.vote(<number>question.id, -1);
    }

    async vote(questionId: number, val: number): Promise<void>{
        if(!this.event) return;

        const updatedQuestion = await eventService.createQuestionVote(<number>this.event.id, questionId, <number>this.user.id, val);

        if(updatedQuestion && updatedQuestion.id){
            const idx = this.event.questions.findIndex(i => i.id === updatedQuestion.id);

            if(~idx){
                this.event.questions.splice(idx, 1, updatedQuestion);
            }
        }
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
        let event = await eventService.getEvent(<number>this.client.id, this.$route.params.eventSlug);

        this.event = event;
    }
}
</script>

<style scoped lang="sass">

.questions
    list-style-type: none
    margin: 0
    padding: 0

    li
        margin: 0
        padding: 0

</style>