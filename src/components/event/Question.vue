<template>
    <div class="question container-fluid">
        <div class="vote-buttons">
            <div>
                <small v-if="question.stats" class="score float-left"><em>{{ question.stats.upvotes }}</em></small>
                <svg @click="upvote(question)" class="vote-btn clickable up mb-1" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M272 480h-96c-13.3 0-24-10.7-24-24V256H48.2c-21.4 0-32.1-25.8-17-41L207 39c9.4-9.4 24.6-9.4 34 0l175.8 176c15.1 15.1 4.4 41-17 41H296v200c0 13.3-10.7 24-24 24z"></path>
                </svg>
            </div>
            <div>
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
        <p class="d-inline-block">
            {{ question.text }}

            <span class="float-right mt-2">
                <div v-if="user && (question.userId === user.id)" class="text-right">
                    <button @click="editQuestion(question)" class="btn btn-sm btn-warning mr-1">
                        <svg class="btn-icon pencil" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M493.255 56.236l-37.49-37.49c-24.993-24.993-65.515-24.994-90.51 0L12.838 371.162.151 485.346c-1.698 15.286 11.22 28.203 26.504 26.504l114.184-12.687 352.417-352.417c24.992-24.994 24.992-65.517-.001-90.51zm-95.196 140.45L174 420.745V386h-48v-48H91.255l224.059-224.059 82.745 82.745zM126.147 468.598l-58.995 6.555-30.305-30.305 6.555-58.995L63.255 366H98v48h48v34.745l-19.853 19.853zm344.48-344.48l-49.941 49.941-82.745-82.745 49.941-49.941c12.505-12.505 32.748-12.507 45.255 0l37.49 37.49c12.506 12.506 12.507 32.747 0 45.255z"></path>
                        </svg>
                    </button>
                    <button @click="deleteQuestion(question);" class="btn btn-sm btn-danger">
                        <svg class="btn-icon delete" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z"></path>
                        </svg>
                    </button>
                </div>
            </span>
        </p>

        <div class="float-right">
        </div>
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

.question
    position: relative
    padding: .4rem
    padding-left: 45px

    p
        padding: 0
        margin-bottom: .4rem

.vote-buttons
    position: absolute
    left: 5px
    top: 13px

.vote-btn
    width: 20px
    max-width: 20px

.score
    position: relative
    top: 2px
    margin-right: 3px

</style>