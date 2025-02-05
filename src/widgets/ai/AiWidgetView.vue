<script lang="ts" setup>
import { BrowserWindowApi, ShortcutApi } from '@widget-js/core'
import { useShortcutListener } from '@widget-js/vue3'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import NProgress from 'nprogress'
import consola from 'consola'
import { storeToRefs } from 'pinia'
import Tip from '@/components/Tip.vue'
import { delay } from '@/utils/TimeUtils'
import { useConfigStore } from '@/store/useConfigStore'
import { useWindowState } from '@/composition/useWindowState'
import WebviewComponent from '@/components/WebviewComponent.vue'

NProgress.start()
const shortcut = ref<string>('')
const webviewRef = ref<InstanceType<typeof WebviewComponent>>()
const configStore = useConfigStore()
const { config, platformUrl, proxyRule } = storeToRefs(configStore)
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
  await delay(500)
  if (proxyRule.value) {
    await BrowserWindowApi.setProxy({ proxyRules: proxyRule.value })
  }
})

useShortcutListener(async (_: string) => {
  if (windowState.isShowing.value) {
    windowState.hide()
    BrowserWindowApi.blur()
  }
  else {
    windowState.show()
    BrowserWindowApi.focus()
    await delay(500)
    webviewRef.value?.focus()
  }
})
</script>

<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget> -->
  <div class="wrapper" :style="{ transform: `translateX(${windowState.animationX.value}vw)` }">
    <WebviewComponent ref="webviewRef" :url="platformUrl" />
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

}

@media (prefers-color-scheme: dark) {
  .background {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.49);
  }
}
</style>
