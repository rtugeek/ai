<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget>-->
  <div class="wrapper" :style="{ transform: `translateX(${animationX}vw)` }">
    <webview ref="webView" src="localhost" partition="persist:cn.widgetjs.widgets.ai.assistant" />
    <div class="background"></div>
    <tip></tip>
  </div>
</template>

<script lang="ts" setup>
import { BrowserWindowApi, ShortcutApi } from '@widget-js/core'
import { useShortcutListener, useWidget } from '@widget-js/vue3'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import { ChatGptConfigData } from '@/widgets/model/ChatGptConfigData'
import Tip from '@/components/Tip.vue'
import NProgress from 'nprogress'
import { delay } from '@/utils/TimeUtils'

NProgress.start()
const shortcut = ref<string>('')
const webView = ref<Electron.WebviewTag>()
const { widgetData, widgetParams } = useWidget(ChatGptConfigData, {
  loadDataByWidgetName: true,
  onDataLoaded: async (data) => {
    if (data) {
      if (data.shortcut != shortcut.value) {
        ShortcutApi.unregister(shortcut.value)
        shortcut.value = data.shortcut
        const result = await ShortcutApi.register(shortcut.value)
      }

      //设置代理
      if (data.hasProxyRule()) {
        console.log(data.getProxyRule())
        await BrowserWindowApi.setProxy({
          proxyRules: data.getProxyRule()
        })
        if (webView.value) {
          webView.value.reload()
        }
      }
    }
  }
})
const x = ref(100)
const windowWidth = screen.width / 3

const animationX = useTransition(x, {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic
})

onMounted(async () => {
  await nextTick()
  show()
  await delay(500)
  if (webView.value) {
    webView.value!.insertCSS('body{color:black}')
    webView.value!.addEventListener('did-start-loading', () => {
      NProgress.start()
    })
    webView.value!.addEventListener('did-fail-load', (e) => {
      console.error(e)
    })

    webView.value.addEventListener('did-frame-finish-load', () => {
      NProgress.done()
    })
    webView.value.addEventListener('did-finish-load', (e) => {
      console.log(e)
    })
    webView.value.loadURL('https://chat.openai.com')
  }
})

watch(animationX, () => {
  if (animationX.value == 100) {
    BrowserWindowApi.hide()
  }
})

const show = () => {
  BrowserWindowApi.show()
  x.value = 0
  console.log('show')
}

const hide = () => {
  x.value = 100
  console.log('hide')
}
const setupWindow = async () => {
  await BrowserWindowApi.setAlwaysOnTop(true)
  await BrowserWindowApi.setBounds({
    x: screen.availWidth - windowWidth,
    y: 0,
    width: windowWidth,
    height: screen.availHeight
  })
}

setupWindow()

const isShowing = computed(() => {
  return x.value == 0
})

useShortcutListener((shortcut: string) => {
  if (isShowing.value) {
    hide()
    BrowserWindowApi.blur()
  } else {
    show()
    BrowserWindowApi.focus()
  }
})
</script>

<style scoped lang="scss">
$padding: 16px;
.background {
  display: block;
  position: absolute;
  width: calc(100% - 16px * 2);
  height: calc(100% - 16px * 2);
  background: white;
}

.wrapper {
  border-radius: 8px 0 0 8px;
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);

  webview {
    width: calc(100% - 16px * 2);
    height: calc(100% - 16px * 2);
    z-index: 99;
    position: absolute;
  }
}

@media (prefers-color-scheme: dark) {
  .background {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.49);
  }
}
</style>
