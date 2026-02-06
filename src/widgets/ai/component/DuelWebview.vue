<script setup lang="ts">
import { ref } from 'vue'
import WebviewUtils from '@widget-js/webview-utils'
import consola from 'consola'
import PromptInput from './PromptInput.vue'
import BaseWebview from './BaseWebview.vue'

const props = defineProps<{
  url1: string
  url2: string
}>()
const webviewFirst = ref<InstanceType<typeof BaseWebview>>()
const webviewSecond = ref<InstanceType<typeof BaseWebview>>()
const prompt = ref('')

function escapeHTML(str: string) {
  return str.replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .replaceAll(/'/g, '&#39;')
}
const sending = ref(false)
async function send() {
  const promptStr = prompt.value
  if (!promptStr) {
    return
  }
  if (sending.value) {
    return
  }
  sending.value = true
  const arr = [webviewFirst.value!.getWebview(), webviewSecond.value!.getWebview()]
  const deepSeekWebview = arr.find(it => it.getURL().includes('deepseek'))
  const chatgptWebview = arr.find(it => it.getURL().includes('chatgpt'))
  try {
    if (deepSeekWebview) {
      const str = promptStr.replaceAll('`', '\`')
      await WebviewUtils.react.setInputValue(deepSeekWebview, '#chat-input', str)
      // language=JavaScript
      await WebviewUtils.executeJavaScript(deepSeekWebview, `
    (function (){
      const buttons = document.querySelectorAll('[role="button"]');
      if (buttons.length > 0) {
        const sendButton = buttons[buttons.length - 1];
        sendButton.click()
      }
    })()
  `)
    }
    if (chatgptWebview) {
      const codeStr = escapeHTML(promptStr).replaceAll('`', '\`')
      // language=JavaScript
      await WebviewUtils.executeJavaScript(chatgptWebview, `
    (function (){
      const el = document.querySelector('#prompt-textarea')
      if (el) {
        el.innerHTML= \`<p>${codeStr}</p>\`
      }
    })()`)
      // language=JavaScript
      await WebviewUtils.executeJavaScript(chatgptWebview, `
    (function () {
      const sendButton = document.querySelector('[data-testid="send-button"]');
      if (sendButton) {
        sendButton.click()
      }
    })()
  `)
    }
    prompt.value = ''
  }
  catch (e) {
    consola.info(e)
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="flex gap-2">
    <BaseWebview ref="webviewFirst" class="first" :url="props.url1" />
    <BaseWebview ref="webviewSecond" class="second" :url="props.url2" />
    <PromptInput v-model="prompt" @send="send" />
  </div>
</template>

<style scoped lang="scss">
webview {
  --padding: 12px;
  --width: calc((var(--widget-inner-width) - var(--padding)) / 2);
  width: var(--width);
  flex: 1;
  height: calc(100% - var(--padding) * 2 - 160px);
  z-index: 99;
  position: absolute;
  border-radius: 4px;
  overflow: hidden;

  &.first {
    left: var(--padding);
  }

  &.second {
    left: calc(50vw + var(--padding)/2);
  }
}
</style>
