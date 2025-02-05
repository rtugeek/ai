<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import { delay } from '@/utils/TimeUtils'

const props = defineProps<{
  url: string
}>()
const webView = ref<Electron.WebviewTag>()

defineExpose({ focus: async () => {
  webView.value!.focus()
  await delay(200)
  // language=JavaScript
  webView.value?.executeJavaScript(`(function() {
        let promptTextarea = document.querySelector('#prompt-textarea')
        if (promptTextarea) {
          promptTextarea.focus()
        }
    })()`)
}, loadURL: (url: string) => {
  webView.value?.loadURL(url)
} })

onMounted(async () => {
  await nextTick()
  await delay(500)
  if (webView.value) {
    webView.value!.insertCSS('body{color:black}')
    webView.value!.addEventListener('did-start-loading', () => {
      NProgress.start()
    })

    webView.value!.addEventListener('did-fail-load', (e) => {
      const message = e.errorCode == -3 ? '-3:如果出现人机无限验证，请尝试切换代理IP' : `${e.errorDescription} ${e.errorCode}`
      ElMessage({
        message,
        type: 'error',
        plain: true,
      })
      console.error(e)
    })

    webView.value.addEventListener('did-frame-finish-load', () => {
      NProgress.done()
    })

    webView.value.addEventListener('did-finish-load', (_) => {
      NProgress.done()
    })
    webView.value.loadURL(props.url)
  }
})
</script>

<template>
  <webview ref="webView" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari" src="localhost" partition="persist:cn.widgetjs.widgets.ai.assistant" />
</template>

<style scoped lang="scss">
webview {
  width: calc(100% - 16px * 2);
  height: calc(100% - 16px * 2);
  z-index: 99;
  position: absolute;
}
</style>
