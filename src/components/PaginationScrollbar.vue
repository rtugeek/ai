<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { computed, onUpdated, ref, useTemplateRef, watch } from 'vue'

const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  pageCount: {
    type: Number,
    default: 15,
  },
})
const bottomRef = useTemplateRef<HTMLSpanElement>('bottomRef')
const targetIsVisible = useElementVisibility(bottomRef)
const currentPage = ref(1)
const currentShowCount = computed(() => {
  return currentPage.value * props.pageCount
})
const showedData = computed(() => {
  return props.data.slice(0, currentShowCount.value)
})

onUpdated(() => {
  currentPage.value = 1
})

watch(targetIsVisible, (newValue) => {
  if (newValue) {
    if (currentShowCount.value < props.data.length) {
      currentPage.value++
    }
  }
})
</script>

<template>
  <ElScrollbar :height="height">
    <slot name="default" :data="showedData" />
    <span ref="bottomRef" />
  </ElScrollbar>
</template>

<style scoped lang="scss">

</style>
