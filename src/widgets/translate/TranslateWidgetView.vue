<script setup lang="ts">
import { Copy } from '@icon-park/vue-next'
import { useStorage, useTitle, watchDebounced } from '@vueuse/core'
import { useAiChat } from '@widget-js/ai-component'
import { ElNotification } from 'element-plus'
import { reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Prompt } from '@/api/Prompt'
import Logo from '@/assets/images/globe_showing_asia-australia_3d.png'
import EmojiLogo from '@/components/EmojiLogo.vue'
import LanguageSelect from '@/components/LanguageSelect.vue'
import Window from '@/components/window/Window.vue'
import WindowTitleBar from '@/components/window/WindowTitleBar.vue'
import { useRouteAiConfig } from '@/composition/useRouteAiConfig'
import { TranslateContext } from '@/data/TranslateContext'

useRouteAiConfig()
const route = useRoute()
const firstLang = useStorage('first-lang', 'zh')
const secondLang = useStorage('second-lang', 'en')
const context = reactive<TranslateContext>(new TranslateContext({
  content: route.query.content as string,
  extra: (route.query.extra ?? '') as string,
}))

const id = context.getMD5()
const aiChat = useAiChat({ name: `翻译:${id}`, id: `translate:${id}`, prompt: context.fullFill(Prompt.translate), onLoad: () => {
  if (aiChat.latestResponseContent.value) {
    return
  }
  aiChat.sendWithStream(context.content ?? '', true)
} })

function copy() {
  navigator.clipboard.writeText(aiChat.latestResponseContent.value)
  ElNotification({
    title: '提示',
    message: '已复制到剪贴板',
    type: 'success',
    position: 'bottom-right',
  })
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
  aiChat.updateChat({ name: `翻译:${id}`, id: `translate:${id}`, prompt: context.fullFill(Prompt.translate) })
}

useTitle('翻译')

watchEffect(() => {
  context.secondLang = secondLang.value
  context.firstLang = firstLang.value
})
</script>

<template>
  <Window>
    <div class="pl-2">
      <el-form ref="formRef" class="mt-2" inline>
        <el-form-item label="母语" prop="knowledge">
          <LanguageSelect v-model="firstLang" />
        </el-form-item>
        <el-form-item label="第二语言" prop="knowledge">
          <LanguageSelect v-model="secondLang" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generate">
            翻译
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex flex-col h-full p-2 gap-2">
      <el-input v-model="context.content" type="textarea" class="flex-1 h-full" style="min-height: 150px" />
      <div class="result">
        <pre>{{ aiChat.latestResponseContent }}</pre>
        <div class="btn-copy" @click="copy">
          <Copy />
        </div>
      </div>
    </div>
    <template #title>
      <WindowTitleBar title="翻译">
        <template #logo>
          <EmojiLogo :src="Logo" glow-color="#47b9ff" />
        </template>
      </WindowTitleBar>
    </template>
  </Window>
</template>

<style lang="scss">
.result{
  border: var(--surface-border);
  border-radius: 8px;
  padding: 12px;
  position: relative;
  flex: 1;
  pre{
    font-family: inherit;
    text-wrap: wrap;
  }
  .btn-copy{
    width: 24px;
    height: 24px;
    position: absolute;
    text-align: center;
    opacity: 0.3;
    line-height: 1.6;
    font-size: 18px;
    top:12px;
    padding: 4px;
    right: 12px;
    cursor: pointer;
    border-radius: 4px;
    border: var(--surface-border);
    &:hover{
      opacity: 1;
    }
  }
}

.el-textarea__inner{
  height: 100%;
}
.el-form-item{
  margin-bottom: 0.5rem;
}
</style>
