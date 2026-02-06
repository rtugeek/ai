<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useAiChat } from '@widget-js/ai-component'
import { BrowserWindowApi, ElectronUtils } from '@widget-js/core'
import { ElNotification } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Prompt } from '@/api/Prompt'
import ExplodingHead from '@/assets/images/exploding_head_3d.png'
import ContextMenu from '@/components/ContextMenu.vue'
import EmojiLogo from '@/components/EmojiLogo.vue'
import MarkdownMap from '@/components/MarkdownMap.vue'
import Window from '@/components/window/Window.vue'
import WindowTitleBar from '@/components/window/WindowTitleBar.vue'
import { useRouteAiConfig } from '@/composition/useRouteAiConfig'
import { CommonContext } from '@/data/CommonContext'

const markdownMapRef = ref<InstanceType<typeof MarkdownMap>>()
const contextMenuRef = ref<InstanceType<typeof ContextMenu>>()
const aiConfig = useRouteAiConfig()
const route = useRoute()
const context = reactive<CommonContext>(new CommonContext({
  content: route.query.content as string,
  extra: (route.query.extra ?? '') as string,
}))

const id = context.getMD5()
const aiChat = useAiChat({ name: `思维导图:${id}`, id: `mind-map:${id}`, onLoad: () => {
  if (aiChat.latestResponseContent.value) {
    return
  }
  aiChat.sendWithStream(context.fullFill(Prompt.mindMap), true)
} })

let currentText = ''

function onNodeClick(event: { text: string, x: number, y: number }) {
  currentText = event.text
  contextMenuRef.value?.show(event.x, event.y)
}

function copy() {
  navigator.clipboard.writeText(currentText)
  ElNotification({
    title: '提示',
    message: '已复制到剪贴板',
    type: 'success',
    position: 'bottom-right',
  })
}

async function view() {
  const url = new URL(window.location.href)
  url.searchParams.set('content', currentText)
  if (context.extra) {
    url.searchParams.set('extra', context.extra)
  }
  if (ElectronUtils.hasElectronApi()) {
    BrowserWindowApi.openUrl(url.toString())
  }
  else {
    const bounds = await BrowserWindowApi.getBounds()
    BrowserWindowApi.openUrl(url.toString(), {
      ...bounds,
    })
  }
}

function generate() {
  if (!context.content) {
    ElNotification({
      title: '提示',
      message: '请输入内容',
      type: 'warning',
      position: 'bottom-right',
    })
  }
  const id = context.getMD5()
  aiChat.updateChat({ name: `思维导图:${id}`, id: `mind-map:${id}` })
}

onMounted(async () => {
  await nextTick()
  if (!aiConfig.config.url && !aiConfig.config.apiKey) {
    ElNotification({
      title: '提示',
      message: '请先到设置中配置API KEY',
      type: 'warning',
      position: 'bottom-right',
      offset: 48,
      duration: 15000,
    })
  }
})
useTitle('思维导图')
</script>

<template>
  <Window title="思维导图">
    <div class="pl-2">
      <el-form ref="formRef" class="mt-2" inline>
        <el-form-item label="内容" prop="knowledge">
          <el-input v-model="context.content" maxlength="10000" />
        </el-form-item>
        <el-form-item label="其他说明">
          <el-input v-model="context.extra" maxlength="500" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generate">
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <ContextMenu ref="contextMenuRef" @copy="copy" @view="view" />
    <MarkdownMap ref="markdownMapRef" :markdown="aiChat.latestResponseContent.value" @node-click="onNodeClick" />
    <template #title>
      <WindowTitleBar title="思维导图">
        <template #logo>
          <EmojiLogo :src="ExplodingHead" glow-color="rgb(243, 127, 89)" />
        </template>
      </WindowTitleBar>
    </template>
  </Window>
</template>

<style lang="scss">
.mind-map-wrapper{
  color: white;
}

.el-form-item{
  margin-bottom: 0.5rem;
}
</style>
