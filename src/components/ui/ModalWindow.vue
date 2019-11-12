<template>
    <div @click="onModalBgClick($event);" ref="modalWindow" class="__modal-window__" :class="classObject">
        <div class="__modal-dialog__">
            <div class="clearfix">
                <span ref="modalClose" class="__modal-close__ clickable text-right mb-0">
                    CLOSE <span class="times">&times;</span>
                </span>
            </div>
            <div class="__modal-body__">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
'use strict';

import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';

@Component
export default class ModalWindow extends Vue{
    @Prop({ default: 'medium' }) size!: string;

    modalActive: boolean = false;

    onModalBgClick(event: MouseEvent): void{
        const { target } = event;

        if(
               target === this.$refs.modalWindow
            || target === this.$refs.modalClose
        ){
            this.close();
        }
    }

    open(): void{
        document.body.style.overflowY = 'hidden';
        this.modalActiveStateChange(this.modalActive = true);
    }

    close(): void{
        document.body.style.overflowY = 'auto';
        this.modalActiveStateChange(this.modalActive = false);
    }

    keyupHandler(e: any): void{
        e = e || window.event;

        let escape = false;
        if('key' in e){
            escape = (e.key === 'Escape' || e.key === 'Esc');
        }
        else{
            escape = e.keyCode === 27;
        }
        escape && this.close();
    }

    /*
        =======
        GETTERS
        =======
    */
    get classObject(){
        return {
            active:    this.modalActive,
            'size-sm': this.size === 'small',
            'size-md': this.size === 'medium',
            'size-lg': this.size === 'large',
            'size-xl': this.size === 'extra-large'
        }
    }


    /*
        ========
        WATCHERS
        ========
    */
    @Watch('modalActive')
    modalActiveWatcher(active: boolean): void{ }


    /*
        ==============
        EVENT EMITTERS
        ==============
    */
    @Emit('modalActiveStateChange')
    modalActiveStateChange(active: boolean): void{ }


    /*
        ===============
        LIFECYCLE HOOKS
        ===============
    */
    created(): void{
        document.addEventListener('keyup', this.keyupHandler);
    }

    destroyed(): void{
        document.removeEventListener('keyup', this.keyupHandler);
    }

}
</script>

<style scoped lang="sass">

@import '@/style/variables'

.__modal-window__
    position: fixed
    z-index: 1000
    top: -100%
    left: 0
    width: 100%
    height: 100%
    overflow-y: auto

    background-color: rgba($dark-gray, .9)
    
    &.active
        top: 0
        left: 0

        .__modal-dialog__
            opacity: 1
            margin: 100px auto
            transition: margin .3s ease .1s, opacity .375s ease .25s

    &.size-sm .__modal-dialog__
        width: 600px
    &.size-md .__modal-dialog__
        width: 900px
    &.size-lg .__modal-dialog__
        width: 1200px
    &.size-xl .__modal-dialog__
        width: 1500px
        

.__modal-dialog__
    width: 900px
    max-width: 90%
    padding: 1rem
    margin: -100% auto
    opacity: 0

    background-color: white

.__modal-close__
    position: relative
    float: right
    font-size: 1.1rem
    top: -5px

.__modal-close__ .times
    position: relative
    font-size: 1.9rem
    line-height: .2
    top: 3px
    left: 3px

.clearfix::after
    content: ''
    display: table
    clear: both

</style>