<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget>-->
  <div class="wrapper">
    <webview src="https://chat.openai.com" partition="persist:cn.widgetjs.widgets.ai.assistant"/>
    <div class="background"></div>
    <tip></tip>
  </div>
</template>

<script lang="ts" setup>
import {BrowserWindowApi, ShortcutApi} from "@widget-js/core";
import {useShortcutListener, useWidget} from "@widget-js/vue3";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {TransitionPresets, useTransition} from "@vueuse/core";
import {ChatGptConfigData} from "@/widgets/model/ChatGptConfigData";
import Tip from "@/components/Tip.vue";

const shortcut = ref<string>('')
const proxyRule = ref<string>('')
const {widgetData, widgetParams, sizeStyle} = useWidget(ChatGptConfigData, {
  loadDataByWidgetName: true,
  onDataLoaded: async (data) => {
    if (data) {
      if (data.shortcut != shortcut.value) {
        ShortcutApi.unregister(shortcut.value);
        shortcut.value = data.shortcut;
        const result = await ShortcutApi.register(shortcut.value)
      }

      //设置代理
      if (data.hasProxyRule()) {
        console.log(data.getProxyRule())
        await BrowserWindowApi.setProxy({
          proxyRules: data.getProxyRule()
        })
      }
    }
  }
});
const x = ref(screen.width)
const windowWidth = screen.width / 3

const animationX = useTransition(x, {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})

onMounted(async () => {
  await nextTick();
  show();
})

watch(animationX, () => {
  BrowserWindowApi.setBounds({x: animationX.value})
})

const show = () => {
  x.value = screen.width - windowWidth
}

const hide = () => {
  x.value = screen.width
}
const setupWindow = async () => {
  await BrowserWindowApi.setAlwaysOnTop(true)
  await BrowserWindowApi.setBounds({
    x: x.value,
    y: 0,
    width: windowWidth,
    height: screen.availHeight
  })
}

setupWindow()

const isShowing = computed(() => {
  return x.value == screen.width - windowWidth
})

useShortcutListener((shortcut: string) => {
  if (isShowing.value) {
    hide()
    BrowserWindowApi.blur();
  } else {
    show();
    BrowserWindowApi.focus();
  }
})
</script>

<style scoped lang="scss">
$padding: 16px;
.wrapper {
  border-radius: 8px 0 0 8px;
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);

  .background {
    display: block;
    position: absolute;
    width: calc(100% - 16px * 2);
    height: calc(100% - 16px * 2);
    background: white;
  }


  webview {
    width: calc(100% - 16px * 2);
    height: calc(100% - 16px * 2);
    z-index: 99;
    position: absolute;
  }
}

</style>
