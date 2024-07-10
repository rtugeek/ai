<script lang="ts" setup>
import { BrowserWindowApi, ShortcutApi } from '@widget-js/core'
import { useShortcutListener, useWidgetParams } from '@widget-js/vue3'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { TransitionPresets, useDebounceFn, useTransition } from '@vueuse/core'
import NProgress from 'nprogress'
import consola from 'consola'
import { ElMessage } from 'element-plus'
import Tip from '@/components/Tip.vue'
import { delay } from '@/utils/TimeUtils'
import { useConfig } from '@/composition/useConfig'

NProgress.start()
const shortcut = ref<string>('')
const webView = ref<Electron.WebviewTag>()
const widgetParams = useWidgetParams()
consola.info('widget id', widgetParams.id)
const { config, proxyRule, platformUrl } = useConfig()
async function updateShortcut() {
  ShortcutApi.unregister(shortcut.value)
  shortcut.value = config.value.shortcut
  await ShortcutApi.register(shortcut.value)
}
watch(config, async () => {
  if (config.value.shortcut != shortcut.value) {
    updateShortcut()
  }
}, { deep: true })

watch(platformUrl, () => {
  if (webView.value) {
    webView.value.loadURL(platformUrl.value)
  }
})

const reloadProxy = useDebounceFn(async () => {
  await BrowserWindowApi.setProxy({ proxyRules: proxyRule.value })
  window.location.reload()
}, 2000)

watch(proxyRule, async () => {
  consola.info('new proxy', proxyRule.value)
  reloadProxy()
})
const x = ref(100)
const windowWidth = screen.width / 3

const animationX = useTransition(x, {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})

onMounted(async () => {
  await nextTick()
  show()
  updateShortcut()
  await delay(500)
  if (webView.value) {
    await BrowserWindowApi.setProxy({ proxyRules: proxyRule.value })
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
    webView.value.loadURL(platformUrl.value)
  }
})

watch(animationX, () => {
  if (animationX.value == 100) {
    BrowserWindowApi.hide()
  }
})

function show() {
  BrowserWindowApi.show()
  x.value = 0
}

function hide() {
  x.value = 100
}

async function setupWindow() {
  await BrowserWindowApi.setup({
    width: windowWidth,
    height: screen.availHeight,
    resizable: false,
    alwaysOnTop: true,
  })
  await BrowserWindowApi.setPosition({
    x: screen.availWidth - windowWidth,
    y: 0,
  })
}

setupWindow()

const isShowing = computed(() => {
  return x.value == 0
})

useShortcutListener(async (_: string) => {
  if (isShowing.value) {
    hide()
    BrowserWindowApi.blur()
  }
  else {
    show()
    BrowserWindowApi.focus()
    await delay(500)
    webView.value!.focus()
    await delay(200)
    // language=JavaScript
    webView.value?.executeJavaScript(`(function() {
        let promptTextarea = document.querySelector('#prompt-textarea')
        if (promptTextarea) {
            promptTextarea.focus()
        }
    })()`)
  }
})
</script>

<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget> -->
  <div class="wrapper" :style="{ transform: `translateX(${animationX}vw)` }">
    <webview ref="webView" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari" src="localhost" partition="persist:cn.widgetjs.widgets.ai.assistant" />
    <div class="background" />
    <Tip />
  </div>
</template>

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
