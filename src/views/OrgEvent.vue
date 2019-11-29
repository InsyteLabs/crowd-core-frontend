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
                <div v-if="isLocked" class="card p-3 mb-3">
                    <h3 class="mb-4"><b><u>WARNING:</u></b> This Event Has Been Locked</h3>
                    <h5>You may view details about the event but you may not post new questions or chat messages</h5>
                </div>
                <hr v-if="isLocked">

                <div class="card p-3 mb-3">
                    <h3>{{ event.title }}</h3>
                    <p class="mb-0">{{ event.description }}</p>
                </div>
                <div class="row">
                    <div class="col-md-7 mb-3">
                        <EventQuestions></EventQuestions>
                    </div>
                    <div class="col-md-5 mb-3">
                        <EventChat v-if="showChat"></EventChat>
                    </div>
                </div>

                <div class="clearfix">
                    <div @click="onQRCodeClick()" class="qr-code clickable">
                        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path fill="currentColor" d="M152 0H8C3.6 0 0 3.6 0 8v152c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V32h120c4.4 0 8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 480H32V352c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v152c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zM632 0H488c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h120v128c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 344h-16c-4.4 0-8 3.6-8 8v128H488c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h144c4.4 0 8-3.6 8-8V352c0-4.4-3.6-8-8-8zM152 96h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm336 320h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8zM408 96h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm-192 0h-16c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8zm64 0h-16c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V104c0-4.4-3.6-8-8-8z"></path>
                        </svg>
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

import { User, ClientEvent } from '@/models';
import { IClient }           from '@/interfaces';

import EventQuestions    from '@/components/event/EventQuestions.vue';
import EventChat         from '@/components/event/EventChat.vue';
import EventPasswordForm from '@/components/event/EventPasswordForm.vue';
import ModalWindow       from '../components/ui/ModalWindow.vue';

@Component({
    components: {
        EventQuestions,
        EventChat,
        EventPasswordForm
    }
})
export default class OrgEvent extends Vue {
    @Ref('qrModal') qrModal!: ModalWindow;

    qrCodeDataUrl: string = '';
    currentURL:    string = window.location.href;

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


    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    async created(): Promise<void>{
        await this._loadEvent();

        if(this.event){
            QRCode.toDataURL(window.location.href, {width: 850, margin: 1}, (err, url) => {
                if(err) return;

                this.qrCodeDataUrl = url;
            });
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
    }
}
</script>

<style scoped lang="sass">

.login-card
    width: 500px
    max-width: 95%
    margin: 0 auto

.qr-code
    max-width: 50px
    margin-bottom: 1rem
    float: right
.qr-image
    max-width: 100%
    display: block
    margin: 0 auto
</style>