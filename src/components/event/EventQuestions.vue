<template>
    <div class="event-questions container-fluid p-0">
        <div class="card p-3">
            <div class="questions">
                <h4>Question &amp; Answer</h4>
                <transition-group v-if="event.questions && event.questions.length" name="questions" tag="ul">
                    <li v-for="question of event.questions" :key="question.id">
                        <Question
                            :question="question"
                            
                            @editQuestion="onEditQuestion($event)"
                            @deleteQuestion="onDeleteQuestion($event)"
                            @upvote="onUpvoteQuestionClick($event)"
                            @downvote="onDownvoteQuestionClick($event)">
                        </Question>
                    </li>
                </transition-group>
            </div>
            <div>
                <div class="form-group mb-0">
                    <label for="question">Your Question</label>
                    <textarea v-model="question" rows="3" class="form-control form-control-sm mb-1" placeholder="Question text" :disabled="isLocked"></textarea>
                    <button @click="addQuestionClick()" class="btn btn-sm btn-primary mr-1" :disabled="isLocked">Ask Question</button>
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
    question: string = '';


    /*
        ================
        QUESTION METHODS
        ================
    */
    async addQuestionClick(): Promise<void>{
        if(!(this.user   && this.user.id))   return;
        if(!(this.client && this.client.id)) return;
        if(!(this.event  && this.event.id))  return;
        if(this.isLocked)                    return;

        const question: IEventQuestion = {
            eventId: this.event.id,
            userId:  this.user.id,
            text:    this.question,
            hidden:  false
        }

        let newQuestion = await eventService.createEventQuestion(question);

        this.question = '';
    }

    async onEditQuestion(question: IEventQuestion): Promise<void>{
        if(this.isLocked)                    return;
        if(!(this.client && this.client.id)) return;

        const updatedQuestion = await eventService.updateEventQuestion(question);
    }

    async onDeleteQuestion(question: IEventQuestion): Promise<void>{
        if(!this.event)                      return;
        if(this.isLocked)                    return;
        if(!(this.client && this.client.id)) return;

        const deleted = await eventService.deleteEventQuestion(question);
    }

    async onUpvoteQuestionClick(question: IEventQuestion): Promise<void>{
        if(this.isLocked) return;

        this.vote(<number>question.id, 1);
    }

    async onDownvoteQuestionClick(question: IEventQuestion): Promise<void>{
        if(this.isLocked) return;

        this.vote(<number>question.id, -1);
    }

    async vote(questionId: number, val: number): Promise<void>{
        if(this.isLocked)                    return;
        if(!this.event)                      return;
        if(!(this.user && this.user.id))     return;
        if(!(this.client && this.client.id)) return;

        const updatedQuestion = await eventService.createQuestionVote(<number>this.event.id, questionId, <number>this.user.id, val);
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

    get isLocked(): boolean{
        if(!this.event)          return false;
        if(!this.event.settings) return false;

        return !!this.event.settings.isLocked;
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