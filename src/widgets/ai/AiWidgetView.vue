<script lang="ts" setup>
import { BrowserWindowApi, ShortcutApi, SystemApi, delay } from '@widget-js/core'
import { useShortcutListener } from '@widget-js/vue3'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import NProgress from 'nprogress'
import consola from 'consola'
import { storeToRefs } from 'pinia'
import Tip from '@/components/Tip.vue'
import { useConfigStore } from '@/store/useConfigStore'
import { useWindowState } from '@/composition/useWindowState'
import DuelWebview from '@/components/DuelWebview.vue'
import BaseWebview from '@/components/BaseWebview.vue'

NProgress.start()
const shortcut = ref<string>('')
const configStore = useConfigStore()
const { config, platformUrlList, proxyRule } = storeToRefs(configStore)
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

watch(platformUrlList, () => {
  window.location.reload()
})

const reloadProxy = useDebounceFn(async () => {
  await BrowserWindowApi.setProxy({ proxyRules: proxyRule.value })
  window.location.reload()
}, 2000)

watch(proxyRule, async () => {
  consola.info('new proxy', proxyRule.value)
  reloadProxy()
})

const windowState = useWindowState()
windowState.setup()

onMounted(async () => {
  await nextTick()
  windowState.show()
  updateShortcut()
  if (proxyRule.value) {
    await BrowserWindowApi.setProxy({ proxyRules: proxyRule.value })
  }

  const systemUptime = await SystemApi.getUptime()
  if (systemUptime < 5 * 60) {
    // 如果是刚开机 自动隐藏
    await delay(3000)
    windowState.hide()
  }
})

useShortcutListener(async (_: string) => {
  if (windowState.isShowing.value) {
    windowState.hide()
  }
  else {
    windowState.show()
    BrowserWindowApi.focus()
    await delay(500)
    // webviewRef.value?.focus()
  }
})
</script>

<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget> -->
  <div class="wrapper" :style="{ transform: `translateX(${windowState.animationX.value}vw)` }">
    <BaseWebview v-if="platformUrlList.length == 1" class="single" :url="platformUrlList[0]" />
    <DuelWebview v-if="platformUrlList.length == 2" :url1="platformUrlList[0]" :url2="platformUrlList[1]" />
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
  .background {
    border-radius: 4px;
  }
}

.wrapper {
  border-radius: 8px 0 0 8px;
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
}

.single{
  width: calc(100% - 16px * 2);
  height: calc(100% - 16px * 2);
  z-index: 99;
  position: absolute;
  webview {
    width: 100px;
    height: 100%;
  }
}
</style>
