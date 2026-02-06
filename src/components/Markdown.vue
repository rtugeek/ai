<script setup lang="ts">
import { marked } from 'marked'
import { nextTick, onMounted, onUpdated, ref } from 'vue'

const props = defineProps({
  markdown: {
    type: String,
    default: `### 加载中`,
  },
})
const render = new marked.Renderer()
render.link = function (tokens): string {
  const link = marked.Renderer.prototype.link.call(this, tokens)
  return link.replace('<a', '<a target=\'_blank\' ')
}
const markdownRef = ref()
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
})
function update() {
  const content = markdownRef.value
  if (content) {
    content.innerHTML
        = marked(`${props.markdown}`) as string
  }
}

onUpdated(() => {
  update()
})

onMounted(async () => {
  await nextTick()
  update()
})
</script>

<template>
  <div ref="markdownRef" class="markdown-body" />
</template>

<style scoped lang="scss">
.markdown-body{
  background-color: transparent;
}
</style>
