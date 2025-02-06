<script setup lang="ts">
import { ref } from 'vue'
import type { WebviewTag } from '@widget-js/webview-utils'
import { useIntervalFn, watchOnce } from '@vueuse/core'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  url: string
}>()
const webviewRef = ref<WebviewTag>()

const loadingChecker = useIntervalFn(() => {
  if (webviewRef.value) {
    if (!webviewRef.value.isLoading()) {
      NProgress.done()
      loadingChecker.pause()
    }
  }
}, 500)

defineExpose({
  getWebview: () => webviewRef.value!,
  getURL: () => webviewRef.value!.getURL(),
})

let firstLoad = true
watchOnce(webviewRef, () => {
  webviewRef.value!.addEventListener('dom-ready', () => {
    if (firstLoad) {
      if (props.url) {
        webviewRef.value!.loadURL(props.url)
      }
      firstLoad = false
    }
    // language=css
    webviewRef.value!.insertCSS(`
      /* 适用于 WebKit 内核浏览器 */
      ::-webkit-scrollbar {
        width: 12px; /* 滚动条宽度 */
        height: 8px; /* 水平滚动条高度 */
        padding-left: 2px;
        padding-right: 2px;
      }

      /* 滚动条轨道（背景部分） */
      ::-webkit-scrollbar-track {
        background: transparent; /* 背景颜色（浅灰色） */
        border-radius: 10px; /* 圆角 */
      }

      /* 滚动条滑块（可拖动部分） */
      ::-webkit-scrollbar-thumb {
        background: rgba(198, 198, 198, 0.5); /* 渐变色 */
        border-radius: 10px; /* 圆角 */
        transition: background 0.3s ease; /* 过渡动画 */
      }

      /* 悬停时的滚动条滑块 */
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(198, 198, 198, 0.8);
        width: 10px; /* 悬停时稍微加粗 */
        margin: 1px;
      }
    `)
  })
  webviewRef.value!.addEventListener('did-start-loading', () => {
    NProgress.start()
    loadingChecker.resume()
  })
  webviewRef.value!.addEventListener('did-frame-finish-load', () => {
    NProgress.done()
  })

  webviewRef.value!.addEventListener('did-finish-load', async (_) => {
    NProgress.done()
  })

  webviewRef.value!.addEventListener('did-fail-load', (e) => {
    const message = e.errorCode == -3 ? '-3:如果出现人机无限验证，请尝试切换代理IP' : `${e.errorDescription} ${e.errorCode}`
    ElMessage({
      message,
      type: 'error',
      plain: true,
    })
    console.error(e)
  })
})
</script>

<template>
  <webview ref="webviewRef" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari" src="localhost" partition="persist:cn.widgetjs.widgets.ai.assistant" />
</template>

<style scoped lang="scss">
webview{
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  webview{
    background: #292a2d;
  }
}
</style>
