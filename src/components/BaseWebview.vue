<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WebviewTag } from '@widget-js/webview-utils'
import { useIntervalFn, useStorage, watchDebounced, watchOnce } from '@vueuse/core'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import AiSelect from '@/components/AiSelect.vue'
import type { AiPlatform } from '@/utils/AiUtils'
import { AiUtils } from '@/utils/AiUtils'

const props = withDefaults(defineProps<{
  index: number
}>(), {
  index: 0,
})
const webviewRef = ref<WebviewTag>()

const aiService = useStorage<AiPlatform>(`ai-${props.index}`, AiUtils.get(props.index).value)
const aiUrl = computed(() => {
  return AiUtils.getUrl(aiService.value)
})
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

watchDebounced(aiService, () => {
  webviewRef.value!.loadURL(aiUrl.value)
}, { debounce: 500 })
let firstLoad = true
watchOnce(webviewRef, () => {
  webviewRef.value!.addEventListener('dom-ready', () => {
    if (firstLoad) {
      webviewRef.value!.loadURL(aiUrl.value)
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
  <div style="position: relative">
    <webview ref="webviewRef" allowpopups enableblinkfeatures="PreciseMemoryInfo, CSSVariables" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0" src="localhost" partition="persist:cn.widgetjs.widgets.ai.assistant" />
    <AiSelect v-model="aiService" class="ai-selector" />
  </div>
</template>

<style scoped lang="scss">
.ai-selector{
  position: absolute;
  bottom: 8px;
  transform: translateX(-50%);
  left: 50%;
  width: 150px;
  z-index: 999;
  opacity: 0.8;
  transition: opacity 0.4s ease;
  &:hover{
    opacity: 1;
  }
}
webview{
  width: 100%;
  border-radius: 6px;
  height: 100%;
  overflow: hidden;
  background-color: white;
}

@media (prefers-color-scheme: dark) {
  webview{
    background: #292a2d;
  }
}
</style>
