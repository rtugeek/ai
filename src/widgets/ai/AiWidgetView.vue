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
import SettingHeader from '@/widgets/ai/component/SettingHeader.vue'

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
  }
})
</script>

<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget> -->
  <div class="wrapper" :style="{ transform: `translateX(${windowState.animationX.value}vw)` }">
    <!--    <DuelWebview v-if="platformUrlList.length == 2" :url1="platformUrlList[0]" :url2="platformUrlList[1]" /> -->
    <SettingHeader />
    <div class="grid" :class="[`size-${configStore.pageCount}`]">
      <BaseWebview v-for="index in configStore.pageCount" :key="index" :index="index" class="web-page" />
    </div>
    <Tip />
    <div class="background" />
  </div>
</template>

<style scoped lang="scss">
$padding: 12px;
.background {
  display: block;
  position: absolute;
  width: calc(100% - $padding * 2);
  height: calc(100% - $padding * 2);
  .background {
    border-radius: 4px;
  }
}

.wrapper {
  border-radius: 8px 0 0 8px;
  width: 100vw;
  height: 100vh;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  position: relative;
  padding: $padding;
  background: rgba(0, 0, 0, 0.3);
}

.grid{
  display: grid;
  flex: 1;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: $padding;
  grid-row-gap: $padding;
  height: 100%;
  width: 100%;
  &.size-2{
    grid-template-rows: repeat(2, 1fr);
  }
  &.size-4{
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
}

.web-page{
  width: 100%;
  flex: 1;
  background-color: blue;
  border-radius: 6px;
  z-index: 2;
}
</style>
