<template>
    <div class="question container-fluid">
        <div class="vote-buttons">
            <div class="upvote" :class="{ active: question.stats.userVote === 1}">
                <small v-if="question.stats" class="score float-left"><em>{{ question.stats.upvotes }}</em></small>
                <svg @click="upvote(question)" class="vote-btn clickable up mb-1" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M272 480h-96c-13.3 0-24-10.7-24-24V256H48.2c-21.4 0-32.1-25.8-17-41L207 39c9.4-9.4 24.6-9.4 34 0l175.8 176c15.1 15.1 4.4 41-17 41H296v200c0 13.3-10.7 24-24 24z"></path>
                </svg>
            </div>
            <div class="downvote" :class="{ active: question.stats.userVote === -1 }">
                <small v-if="question.stats" class="score float-left"><em>{{ question.stats.downvotes }}</em></small>
                <svg @click="downvote(question)" class="vote-btn clickable down" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M176 32h96c13.3 0 24 10.7 24 24v200h103.8c21.4 0 32.1 25.8 17 41L241 473c-9.4 9.4-24.6 9.4-34 0L31.3 297c-15.1-15.1-4.4-41 17-41H152V56c0-13.3 10.7-24 24-24z"></path>
                </svg>
            </div>
        </div>

        <small>
            <i>
                {{
                    question.user.isAnonymous
                        ? 'Anonymous'
                        : question.user.username
                }}:
            </i>
        </small>

        <p>
            {{ question.text }}


            <span class="float-right mt-2">
                <div v-if="user && (question.userId === user.id)" class="text-right">
                    <EditButton @click="editQuestion(question)"></EditButton>
                    <DeleteButton @click="deleteQuestion(question)"></DeleteButton>
                </div>
            </span>
        </p>


        <div class="clearfix"></div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { User }                       from '@/models';
import { IEventQuestion }             from '@/interfaces';

@Component
export default class Question extends Vue {
    @Prop() question!: IEventQuestion;


    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters['user/user'];
    }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('editQuestion')
    editQuestion(question: IEventQuestion){ }

    @Emit('deleteQuestion')
    deleteQuestion(question: IEventQuestion){ }

    @Emit('upvote')
    upvote(question: IEventQuestion){ }

    @Emit('downvote')
    downvote(question: IEventQuestion){ }
}
</script>

<style scoped lang="sass">

@import '../../style/variables'

.question
    position: relative
    min-height: 75px
    padding: .4rem .4rem .1rem
    padding-left: 45px

    p
        padding: 0
        margin-bottom: .4rem

.vote-buttons
    position: absolute
    left: 5px
    top: 13px

.vote-btn
    color: black
    width: 20px
    max-width: 20px

.upvote.active svg,
.downvote.active svg
    color: $purple

.score
    position: relative
    top: 2px
    margin-right: 3px

</style>