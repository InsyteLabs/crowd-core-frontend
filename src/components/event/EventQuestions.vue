<template>
    <div class="event-questions container-fluid p-0">
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
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import { eventService }            from '@/services';
import { IClient, IEventQuestion } from '@/interfaces';
import { User, ClientEvent }       from '@/models';

import Question from '@/components/event/Question.vue';

@Component({
    components: {
        Question
    }
})
export default class EventQuestions extends Vue {

    // Question fields
    selectedQuestion: IEventQuestion|null = null;
    isAskQuestion:    boolean             = true;
    isEditQuestion:   boolean             = false;
    question:         string              = '';


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
}
</script>

<style scoped lang="sass">

.questions
    ul
        list-style-type: none
        margin: 0
        padding: 0

        li
            margin: 0 0 1rem
            padding: 0
            background-color: #F8F8F8
            border: 1px solid rgba(0, 0, 0, .05)

.questions-move
    transition: transform .75s
</style>