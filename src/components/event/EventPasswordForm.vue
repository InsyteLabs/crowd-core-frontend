<template>
    <div class="container-fluid p-0">
        <div class="card p-3" style="max-width: 500px; margin: auto">
            <form @submit.prevent="onSubmitPasswordClick()">
                <h3 class="text-center mb-3">Event Password Required</h3>
                <div class="form-group mb-2">
                    <label for="event-password">Password</label>
                    <div class="input-group">
                        <input v-model="password" type="password" id="event-password" class="form-control">
                    </div>
                    <label v-show="showError" class="my-2"><b><i>Incorrect Password</i></b></label>
                </div>
                <button type="submit" role="submit" class="btn btn-sm btn-block btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import { ClientEvent } from '@/models';

@Component
export default class EventPasswordForm extends Vue {
    password:  string  = '';
    showError: boolean = false;

    onSubmitPasswordClick(): void{
        const password: string = this.password;

        this.$store.commit('event/updateSubmittedPass', password);

        if(this.password !== this.eventPassword){
            this.showError = true;
        }
    }

    /*
        =======
        GETTERS
        =======
    */
    get event(): ClientEvent|null{
        return this.$store.getters['event/event'];
    }

    get eventPassword(): string|undefined{
        if(!this.event)          return;
        if(!this.event.settings) return;

        return this.event.settings.password;
    }
}
</script>

<style scoped lang="sass">

.card
    width: 500px
    max-width: 95%
    margin: 0 auto
</style>