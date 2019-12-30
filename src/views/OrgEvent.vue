<template>
    <div class="org-event container-fluid">
        <div v-if="event">

            <EventPasswordForm v-if="showPasswordForm"></EventPasswordForm>

            <div v-else-if="showLogin" class="login-card card text-center p-3">
                <h3>Login Required</h3>
                <p class="mb-0">
                    You must be logged in to view this event
                </p>
                <button @click="onLoginBtnClick()" class="btn btn-block btn-primary mt-3">Login</Button>
            </div>

            <div v-else>
                <div class="clearfix">
                    <span class="subscriber-count">
                        {{ subscriberCount }} {{ subscriberCount === 1 ? 'person' : 'people' }} viewing
                    </span>
                </div>

                <div v-if="isLocked" class="card p-3 mb-3">
                    <h3 class="mb-4"><b><u>WARNING:</u></b> This Event Has Been Locked</h3>
                    <h5>You may view details about the event but you may not post new questions or chat messages</h5>
                </div>
                <hr v-if="isLocked">

                <div class="card p-3 mb-3">
                    <div>
                        <h3>{{ event.title }}</h3>
                        <p class="mb-0">{{ event.description }}</p>
                    </div>
                </div>
                <div class="row">
                    <div v-show="showQuestionColumn" class="col-md-7 mb-3">
                        <EventQuestions></EventQuestions>
                    </div>
                    <div v-show="showChatColumn" class="col-md-5 mb-3">
                        <EventChat v-if="showChat"></EventChat>
                        <div v-else>
                            <div class="card p-3">
                                <h4>Event Chat</h4>
                                <ul>
                                    <li class="p-3">
                                        <h5 class="mb-0">
                                            Chat Disabled for this Event
                                        </h5>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clearfix pr-1">
                    <div class="event-icons">
                        <div @click="onQRCodeClick()" class="icon-btn qr-code">
                            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path fill="currentColor" d="M152 0H8C3.6 0 0 3.6 0 8v152c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V32h120c4.4 0 8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 480H32V352c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v152c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zM632 0H488c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h120v128c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 344h-16c-4.4 0-8 3.6-8 8v128H488c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V352c0-4.4-3.6-8-8-8zM152 96h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm336 320h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8zM408 96h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm-192 0h-16c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm64 0h-16c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8z"></path>
                            </svg>
                        </div>

                        <div v-if="showChatIcons && columnToggle" @click="columnToggle = !columnToggle" class="icon-btn q-and-a">
                            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M256 64c123.5 0 224 79 224 176S379.5 416 256 416c-28.3 0-56.3-4.3-83.2-12.8l-15.2-4.8-13 9.2c-23 16.3-58.5 35.3-102.6 39.6 12-15.1 29.8-40.4 40.8-69.6l7.1-18.7-13.7-14.6C47.3 313.7 32 277.6 32 240c0-97 100.5-176 224-176m0-32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26 3.8 8.8 12.4 14.5 22 14.5 61.5 0 110-25.7 139.1-46.3 29 9.1 60.2 14.3 93 14.3 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path>
                            </svg>
                        </div>
                        
                        <div v-if="showChatIcons && !columnToggle" @click="columnToggle = !columnToggle" class="icon-btn chat">
                            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="currentColor" d="M569.9 441.1c-.5-.4-22.6-24.2-37.9-54.9 27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.4 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.1 2.1 18.4 3.7 28 4.8 31.5 57.5 105.5 98 191.8 98 20.8 0 40.8-2.4 59.8-6.8 28.5 18.5 71.6 38.8 125.2 38.8 9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25zM155.4 314l-13.2-3-11.4 7.4c-20.1 13.1-50.5 28.2-87.7 32.5 8.8-11.3 20.2-27.6 29.5-46.4L83 283.7l-16.5-16.3C50.7 251.9 32 226.2 32 192c0-70.6 79-128 176-128s176 57.4 176 128-79 128-176 128c-17.7 0-35.4-2-52.6-6zm289.8 100.4l-11.4-7.4-13.2 3.1c-17.2 4-34.9 6-52.6 6-65.1 0-122-25.9-152.4-64.3C326.9 348.6 416 278.4 416 192c0-9.5-1.3-18.7-3.3-27.7C488.1 178.8 544 228.7 544 288c0 34.2-18.7 59.9-34.5 75.4L493 379.7l10.3 20.7c9.4 18.9 20.8 35.2 29.5 46.4-37.1-4.2-67.5-19.4-87.6-32.4z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <ModalWindow ref="qrModal">
                    <img class="qr-image" :src="qrCodeDataUrl" alt="Event QR Code">
                    <div class="text-center">
                        <i>{{ currentURL }}</i>
                    </div>
                </ModalWindow>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Watch, Ref} from 'vue-property-decorator';
import QRCode                        from 'qrcode';

import { User, ClientEvent }                      from '@/models';
import { IClient, IEventMessage, IEventQuestion } from '@/interfaces';
import { SocketClient }                           from '@/socket-client';
import { ISocketMessage }                         from '@/socket-client/interfaces';

import EventQuestions     from '@/components/event/EventQuestions.vue';
import EventChat          from '@/components/event/EventChat.vue';
import EventPasswordForm  from '@/components/event/EventPasswordForm.vue';
import ModalWindow        from '../components/ui/ModalWindow.vue';

@Component({
    components: {
        EventQuestions,
        EventChat,
        EventPasswordForm
    }
})
export default class OrgEvent extends Vue {
    @Ref('qrModal') qrModal!: ModalWindow;

    socket:          SocketClient|null = null;
    subscriberCount: number            = 1;

    qrCodeDataUrl: string  = '';
    currentURL:    string  = window.location.href;
    columnToggle:  boolean = false;
    windowWidth:   number  = window.innerWidth;

    onQRCodeClick(): void{
        this.qrModal.open();
    }

    onLoginBtnClick(): void{
        let url = '/login';

        const path: string = this.$router.currentRoute.path;
        if(path){
            url += `?to=${ encodeURIComponent(path) }`;
        }

        this.$router.push(url);
    }

    setWindowWidth(): void{
        this.windowWidth = window.innerWidth;
    }


    /*
        =======
        GETTERS
        =======
    */
    get user(): User|null{
        return this.$store.getters['user/user']
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

    get showPasswordForm(): boolean{
        if(!this.event) return false;

        const event: ClientEvent|null = this.event;

        if(!event.settings)                 return false;
        if(!event.settings.requirePassword) return false;

        const password = event.settings.password;

        return password !== this.submittedPass;
    }

    get showQuestionColumn(): boolean{
        if(!this.showChatIcons) return true;

        return !this.columnToggle;
    }

    get showChatColumn(): boolean{
        if(!this.showChatIcons) return true;

        return this.columnToggle;
    }

    get showChat(): boolean{
        if(!this.event) return false;

        const event: ClientEvent|null = this.event;

        if(!event.settings)            return false;
        if(!event.settings.enableChat) return false;

        return true;
    }

    get isLocked(): boolean{
        if(!this.event)          return false;
        if(!this.event.settings) return false;

        return !!this.event.settings.isLocked;
    }

    get showLogin(): boolean{
        if(!this.event)          return false;
        if(!this.event.settings) return false;

        if(this.event.settings.requireLogin){
            if(!this.user)            return true;
            if(this.user.isAnonymous) return true;
        }

        return false;
    }

    get showChatIcons(): boolean{
        return this.windowWidth <= 768;
    }


    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    async created(): Promise<void>{
        await this._loadEvent();

        if(this.event){
            this._startSocketConnection();

            QRCode.toDataURL(window.location.href, {width: 850, margin: 1}, (err, url) => {
                if(err) return;

                this.qrCodeDataUrl = url;
            });
        }

        window.addEventListener('resize', this.setWindowWidth);
    }

    destroyed(): void{
        window.removeEventListener('resize', this.setWindowWidth);

        if(this.socket){
            this.socket.close();

            this.socket = null;
        }
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

        this.$store.dispatch('event/loadQuestions');
        this.$store.dispatch('event/loadMessages');
    }

    private _startSocketConnection(): void{
        if(!this.event)  return;
        if(!this.client) return;

        const baseUrl: string = `${ process.env.VUE_APP_WS_URL }/websocket`,
              channel: string = `client::${ this.client.slug };events::${ this.event.id }`;
        
        this.socket = new SocketClient(baseUrl, channel);

        this.socket.subscribe((message: ISocketMessage) => {
            switch(message.type){
                case SocketClient.SUBSCRIBER_COUNT_UPDATE:
                    console.log('subscriber count updated');
                    console.log(message);
                    this.subscriberCount = (<any>message.data).count;
                    break;
                case SocketClient.EVENT_UPDATED:
                    this.$store.commit('event/updateEvent', <ClientEvent>message.data);
                    break;
                case SocketClient.QUESTION_CREATED:
                    this.$store.dispatch('event/addQuestion', <IEventQuestion>message.data);
                    break;
                case SocketClient.QUESTION_UPDATED:
                    this.$store.dispatch('event/updateQuestion', <IEventQuestion>message.data);
                    break;
                case SocketClient.QUESTION_DELETED:
                    this.$store.dispatch('event/deleteQuestion', <IEventQuestion>message.data);
                    break;
                case SocketClient.MESSAGE_CREATED:
                    this.$store.commit('event/addMessage', <IEventMessage>message.data);
                    break;
                case SocketClient.MESSAGE_UPDATED:
                    this.$store.commit('event/updateMessage', <IEventMessage>message.data);
                    break;
                case SocketClient.MESSAGE_DELETED:
                    this.$store.commit('event/deleteMessage', <IEventMessage>message.data);
                    break;
            }
        });
    }
}
</script>

<style scoped lang="sass">

@import '../style/variables'

.login-card
    width: 500px
    max-width: 98%
    margin: 0 auto


ul
    list-style-type: none
    margin: 0
    padding: 0

    li
        margin: 0 0 1rem
        padding: 0
        background-color: #F8F8F8
        border: 1px solid rgba(0, 0, 0, .05)

.event-icons
    .icon-btn
        background-color: $purple
        color: white
        cursor: pointer
        float: right
        width: 50px
        height: 50px
        padding: .6rem
        border-radius: 50%
        margin-left: .5rem

        &.qr-code
            svg
                width: 90%
                top: 2px
                left: 2px
        &.q-and-a
            svg
                width: 90%
                top: 1px
                left: 2px
        
        svg
            position: relative
            width: 100%

.qr-image
    max-width: 100%
    display: block
    margin: 0 auto

.subscriber-count
    float: right
    background-color: $purple
    color: white
    padding: 1px 5px
    border-radius: 5px
    margin-right: 2px
    margin-bottom: 6px
    margin-top: -10px
    font-size: .9rem
</style>