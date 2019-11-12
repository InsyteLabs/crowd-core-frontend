<template>
    <button @click="click" class="btn">
        <slot></slot>
    </button>
</template>

<script lang="ts">

import { Vue, Component, Emit } from 'vue-property-decorator';

@Component
export default class Button extends Vue {

    @Emit('click')
    click(): void{ }

}
</script>

<style scoped lang="sass">

@import '../../style/variables'

button.btn
    width: 32px
    height: 32px
    padding: 3px
    // border: 1px solid rgba(0, 0, 0, .25)
    margin: 0 3px
    color: $dark-gray

    transition: all .2s ease-in-out

    &:hover
        transform: scale(1.2)

</style>