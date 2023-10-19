<template>
  <OverlapWrapper
      :loading="false"
      :is-auto-hide="false"
      @refresh="refresh"
      :show-config-button="true"
  >
    <template #actions>
      <SettingTwo @click="showConfigRoute" class="icon" theme="outline" size="12" fill="#fff"/>
    </template>
    <div class="container">
      <webview
          class="webview"
          ref="webview"
          :key="refreshKey"
          src="https://chat.openai.com/"
          enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
          :style="{
          backgroundColor: 'white',
          width: `${windowSize.width.value - padding * 2}px`,
          height: `${windowSize.height.value - padding * 2}px`
        }"
          disablewebsecurity
      />
    </div>
    <div
        v-if="showGuide"
        class="guide align-center flex-col justify-center text-lg text-white backdrop-blur-md"
    >
      <span class="mb-3 text-xl font-bold">说明</span>
      <div class="desc flex-col">
        <span>1. 需要科学上网才能使用该组件</span>
        <span>2. 代理规则在组件设置中可以配置</span>
        <span>3. 按 Ctrl+Shift+S 显示或者关闭窗口</span>
      </div>
      <ElButton class="mt-3" @click="disableGuide">知道了</ElButton>
    </div>
  </OverlapWrapper>
</template>

<script lang="ts">
import {
  BrowserWindowApi,
  Channel,
  ClipboardApi,
  ElectronUtils,
  HostedWidgetApi,
  WidgetApi,
  WidgetData,
  WidgetParams
} from '@widget-js/core'
import {TransitionPresets, useMagicKeys, useTransition, useWindowSize} from '@vueuse/core'
import {useIpcListener, useWidget} from '@widget-js/vue3'
import {SettingTwo} from '@icon-park/vue-next'
import {onMounted, ref, watch} from 'vue'
import {ElNotification, ElButton} from 'element-plus'
import OverlapWrapper from '@/widgets/chatgpt-search/OverlapWrapper.vue'
import {delay} from "@/utils/TimeUtils";

export default {
  name: 'NativeChatgpt',
  components: {OverlapWrapper, SettingTwo},
  setup() {
    const widgetParams = WidgetParams.fromCurrentLocation()
    const showGuide = ref(localStorage.getItem(`guide_gpt_${widgetParams.name}`) != 'false')
    const refreshKey = ref(new Date().getTime())
    const showConfigRoute = async () => {
      console.log(widgetParams.id)
      HostedWidgetApi.openConfigRoute(widgetParams.id ?? '', widgetParams)
    }
    const keys = useMagicKeys()
    const ctrlEnter = keys['Ctrl+Enter']
    const clipboardContent = ref('')
    watch(ctrlEnter, (v) => {
      if (v) console.log('Shift + Ctrl + A have been pressed')
    })

    const disableGuide = () => {
      localStorage.setItem(`guide_gpt_${widgetParams.name}`, 'false')
      showGuide.value = false
    }
    const windowSize = useWindowSize()
    const padding = 6
    const webview = ref()
    const preloadPath = ElectronUtils.getAPI().preloadPath
    watch(webview, (newValue) => {
      if (newValue) {
        webview.value.addEventListener('dom-ready', () => {
          console.log('dom-ready')
          addWebviewKeyboardEvent()
          webview.value.executeJavaScript(`
                function sendQuestion() {
                    window.gptSend = document.querySelector("polygon[points='22 2 15 22 11 13 2 9 22 2']").parentNode.parentNode;
                    const rect = window.gptSend.getBoundingClientRect();
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        clientX: rect.left + rect.width / 2,
                        clientY: rect.top + rect.height / 2
                    });
                    window.gptSend.dispatchEvent(event);
                }
                async function sendClipboardQuestion() {
                    window.gptSend = document.querySelector("polygon[points='22 2 15 22 11 13 2 9 22 2']").parentNode.parentNode;
                    const clipboardQuestion = await navigator.clipboard.readText()
                    window.gptInput.value = clipboardQuestion
                    sendQuestion()
                }
                window.gptInput = document.querySelector("textarea[rows='1']");
                if(window.gptInput){
                    window.gptInput.placeholder='按 Ctrl+Enter 发送问题，按 Ctrl+退格 清空内容';
                }

          `)
        })
      }
    })

    async function addWebviewKeyboardEvent() {
      const js = `
            document.addEventListener('keydown',(event)=>{
                console.log("keydown")
                if (event.ctrlKey) {
                    if (event.key === 'Enter') {
                        console.log('Ctrl+Enter pressed');
                        sendQuestion();
                    }else if(event.key === 'Backspace'){
                        window.gptInput.value=''
                    }
                }else if (event.shiftKey) {
                    if (event.key === 'Enter') {
                        sendClipboardQuestion();
                    }
                }
            })
  `
      const result = await webview.value.executeJavaScript(js)
    }

    useIpcListener(Channel.BROWSER_WINDOW, async (args) => {
      const type = args[0]
      if (type == 'blur') {
        // BrowserWindowApi.hide()
      } else if (type == 'focus') {
        console.log('focus')
        const clipboard = await ClipboardApi.getText()
        if (clipboard != clipboardContent.value) {
          clipboardContent.value = clipboard
        }
      } else if (type == 'refresh') {
        refresh()
      } else if (type == 'settings') {
        HostedWidgetApi.openConfigRoute(widgetParams.id, widgetParams)
      }
    })
    watch(clipboardContent, (newValue) => {
      if (newValue != '') {
        ElNotification.info({
          title: '按Shift+Enter发送剪切板内容',
          message: newValue,
          type: 'warning',
          position: 'bottom-right',
          offset: 100
        })
      }
    })
    useIpcListener(Channel.SHORTCUT, async (args) => {
      await BrowserWindowApi.show()
      await BrowserWindowApi.setAlwaysOnTop(true)
      await BrowserWindowApi.center()
      await BrowserWindowApi.setIgnoreMouseEvent(false)
      await BrowserWindowApi.focus()
      // await setQuestion()
    })
    const refresh = () => {
      refreshKey.value = new Date().getTime()
    }

    const source = ref(0)

    const output = useTransition(source, {
      duration: 1000,
      transition: TransitionPresets.easeInOutCubic,
    })
    watch(output, (newValue) => {
      BrowserWindowApi.setPosition(100, Math.round(newValue), false)
    })

    onMounted(async () => {
      BrowserWindowApi.setPosition(100, 0, false)
      await delay(1000);
      source.value = 500
    })
    return {
      windowSize,
      showGuide,
      disableGuide,
      refresh,
      webview,
      refreshKey,
      padding,
      preloadPath,
      showConfigRoute
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.container {
  padding: 8px;
}

.webview {
  width: calc(100% - 16px);
  height: 100%;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2));
}

.icon {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  cursor: pointer;
  padding: 4px;
  z-index: 1;
}

.guide {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
