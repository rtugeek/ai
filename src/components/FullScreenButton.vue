<script setup lang="ts">
import { FullScreen, OffScreen } from '@icon-park/vue-next'
import { useEventListener } from '@vueuse/core'

const props = defineProps({
  selector: {
    type: String,
    required: true,
  },
})
const model = defineModel<boolean>()

function exit() {
  document.exitFullscreen()
}

function enter() {
  const element = document.querySelector(props.selector)
  element?.requestFullscreen()
}

useEventListener('fullscreenchange', () => {
  model.value = document.fullscreenElement != null
})
</script>

<template>
  <el-button v-show="!model" size="small" @click="enter">
    <FullScreen size="18" />
  </el-button>
  <el-button v-show="model" size="small" @click="exit">
    <OffScreen size="18" />
  </el-button>
</template>

<style scoped lang="scss">

</style>
