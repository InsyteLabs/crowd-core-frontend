<template>
    <div class="app-messages">
        <ul v-if="showMessages">
            <li :class="'app-message ' + message.type" v-for="message of messages" :key="message.id">
                <span @click="removeMessage(message)" class="app-message-close clickable">&times;</span> {{ message.text }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component } from 'vue-property-decorator';
import { IAppMessage }    from '@/interfaces';
import { AppMessageType } from '@/constants';

@Component
export default class AppMessages extends Vue {
    private DEFAULT_TIMEOUT: number = 5000; // 5 seconds
    private DEFAULT_TYPE:    string = AppMessageType.INFO;

    addMessage(message: IAppMessage): void{
        if(!message.type) message.type = this.DEFAULT_TYPE;

        this.$store.dispatch('app/addAppMessage', message);

        if(message.autoClose){
            const timeout: number = message.timeout || this.DEFAULT_TIMEOUT;

            setTimeout(() => this.$store.dispatch('app/removeAppMessage', message), timeout);
        }
    }

    success(message: IAppMessage): void{
        message.type = AppMessageType.SUCCESS;

        this.addMessage(message);
    }

    info(message: IAppMessage): void{
        message.type = AppMessageType.INFO;

        this.addMessage(message);
    }

    warn(message: IAppMessage): void{
        message.type = AppMessageType.WARN;

        this.addMessage(message);
    }

    error(message: IAppMessage): void{
        message.type = AppMessageType.ERROR;

        this.addMessage(message);
    }

    removeMessage(message: IAppMessage){
        this.$store.dispatch('app/removeAppMessage', message);
    }

    get messages(): IAppMessage[]{
        return this.$store.getters['app/appMessages'];
    }

    get showMessages(): boolean{
        return (<any>this.$root).$showMessages
    }
}
</script>

<style scoped lang="sass">

.app-messages
    z-index: 1001
    position: fixed
    width: 100%
    top: 0
    left: 0
    overflow-y: scroll
    max-height: 80%

    @media screen and (min-width: 768px)
        top: 75px
        right: 5px
        left: auto
        width: auto


ul
    list-style-type: none
    margin: 0
    padding: 0
    width: 100%

    @media screen and (min-width: 768px)
        width: 425px
        max-width: 425px


li.app-message
    position: relative
    background: black
    color: white
    margin: 0 0 3px
    padding: .25rem .25rem .25rem 32px
    font-size: 1rem
    font-weight: regular

    &.info
        color: darken(blue, 25%)
        border: 1px solid blue
        border-left: 4px solid blue
        background-color: #96b4ec

    &.success
        color: darken(green, 25%)
        border: 1px solid green
        border-left: 4px solid green
        background-color: #b8e6b8
    
    &.warn
        color: darken(orange, 35%)
        border: 1px solid orange
        border-left: 4px solid orange
        background-color: #f9d38f
    
    &.error
        color: darken(red, 25%)
        border: 1px solid red
        border-left: 4px solid red
        background-color: #f0a4a4

    @media screen and (min-width: 768px)
        margin: 0 0 5px
        font-weight: semi-bold

.app-message-close
    position: absolute
    top: 50%
    left: 16px
    transform: translateX(-50%)
    font-size: 1.6rem
    line-height: 0
</style>