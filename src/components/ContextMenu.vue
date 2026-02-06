<script setup lang="ts">
import { delay } from '@widget-js/core'
import { computed, ref } from 'vue'

const emits = defineEmits(['copy', 'view'])
const left = ref(0)
const top = ref(0)
const show = ref(false)

function clickListener() {
  if (show.value) {
    show.value = false
    removeEventListener('click', clickListener)
    removeEventListener('contextmenu', clickListener)
  }
}
defineExpose({
  show: async (x: number, y: number) => {
    left.value = x
    top.value = y
    show.value = true
    await delay(100)
    window.addEventListener('click', clickListener)
    window.addEventListener('contextmenu', clickListener)
  },
})

const leftPX = computed(() => `${left.value}px`)
const topPX = computed(() => `${top.value}px`)
</script>

<template>
  <div v-show="show" class="context-menu">
    <div class="flex flex-col gap-2">
      <div class="context-menu-item" @click="emits('copy')">
        复制
      </div>
      <div class="context-menu-item" @click="emits('view')">
        查看
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.context-menu{
  position: fixed;
  top: v-bind(topPX);
  left: v-bind(leftPX);
  z-index: 10;
  padding: 8px;
  border: var(--surface-border);
  background: #e0e0e0;
  border-radius: 4px;
  .context-menu-item{
    cursor: pointer;
  }
}
</style>
