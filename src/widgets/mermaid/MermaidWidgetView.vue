<script setup lang="ts">
import { useDark, useTitle } from '@vueuse/core'
import { useAiChat } from '@widget-js/ai-component'
import { ElNotification } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { delay } from '@widget-js/core'
import { useI18n } from 'vue-i18n'
import MermaidChart from './MermaidChart.vue'
import { CommonContext } from '@/data/CommonContext'
import { useRouteAiConfig } from '@/composition/useRouteAiConfig'
import WindowTitleBar from '@/components/window/WindowTitleBar.vue'
import Window from '@/components/window/Window.vue'
import EmojiLogo from '@/components/EmojiLogo.vue'
import Logo from '@/assets/images/bar_chart.png'
import { Prompt } from '@/api/Prompt'
import ThemeToggle from '@/components/ThemeToggle.vue'

const aiConfig = useRouteAiConfig()
const { t } = useI18n()
const isDark = useDark()
const chartTypes = computed(() => [
  { name: t('flowchart'), value: 'Flowchart' },
  { name: t('sequenceDiagram'), value: 'Sequence Diagram' },
  { name: t('classDiagram'), value: 'Class Diagram' },
  { name: t('stateDiagram'), value: 'State Diagram' },
  { name: t('erDiagram'), value: 'ER Diagram' },
  { name: t('ganttChart'), value: 'Gantt Chart' },
  { name: t('pieChart'), value: 'Pie Chart' },
  { name: t('quadrantChart'), value: 'Quadrant Chart' },
  { name: t('gitGraph'), value: 'Git Graph' },
  { name: t('mindmap'), value: 'Mindmap' },
  { name: t('timeline'), value: 'Timeline' },
])
const chartType = ref('Flowchart')

function getPrompt() {
  return context.fullFill(Prompt.mermaidDiagram).replace('{{chartType}}', chartType.value)
}
const route = useRoute()
const context = reactive<CommonContext>(new CommonContext({
  content: route.query.content as string,
  extra: (route.query.extra ?? '') as string,
}))

const id = context.getMD5()
const aiChat = useAiChat({ name: `图表:${id}`, id: `diagram:${id}`, prompt: getPrompt(), onLoad: () => {
  if (aiChat.latestResponseContent.value) {
    return
  }
  aiChat.sendWithStream(context.content ?? '', true)
} })
const result = ref(`graph TD 
     A[开始] --> B[接收用户输入] 
     B --> C{输入是否为空?} 
     C -- 是 --> D[提示用户输入内容] 
     D --> B 
     C -- 否 --> E[处理用户输入] 
     E --> F[生成mermaid流程图] 
     F --> G[输出流程图] 
     G --> H[结束] `)
function generate() {
  if (!context.content) {
    ElNotification({
      title: t('notice'),
      message: t('inputContent'),
      type: 'warning',
      position: 'bottom-right',
    })
    return
  }
  if (!aiConfig.check()) {
    return
  }
  const id = context.getMD5()
  aiChat.updateChat({ name: `图表:${id}`, id: `diagram:${id}`, prompt: getPrompt() })
  aiChat.sendWithStream(context.content, true)
}

useTitle(computed(() => t('mermaidChart')))

watch(aiChat.latestResponseContent, (val) => {
  if (val) {
    result.value = val
  }
})

onMounted(async () => {
  await nextTick()
  await delay(1000)
  if (aiChat.latestResponseContent.value) {
    result.value = aiChat.latestResponseContent.value
  }
  else {
    aiChat.latestResponseContent.value = result.value
  }
})
</script>

<template>
  <Window>
    <div class="flex pl-2 items-center justify-between pr-2">
      <el-form ref="formRef" class="mt-2" inline>
        <el-form-item :label="t('content')">
          <el-input v-model="context.content" @keyup.enter="generate" />
        </el-form-item>
        <el-form-item :label="t('chartType')">
          <el-select v-model="chartType" style="width: 150px">
            <el-option v-for="item in chartTypes" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generate">
            {{ t('generate') }}
          </el-button>
        </el-form-item>
      </el-form>
      <ThemeToggle />
    </div>
    <div class="flex flex-1 p-2 gap-2">
      <el-input v-model="aiChat.latestResponseContent.value" type="textarea" class="flex-1 h-full" style="min-height: 150px" />
      <MermaidChart :code="aiChat.latestResponseContent.value" />
    </div>
    <template #title>
      <WindowTitleBar :title="t('mermaidChart')">
        <template #logo>
          <EmojiLogo :src="Logo" :glow-color="isDark ? '#d6cde1' : ''" />
        </template>
        <template #actions />
      </WindowTitleBar>
    </template>
  </Window>
</template>

<style lang="scss">
.el-textarea__inner{
  height: 100%;
}
.el-form-item{
  margin-bottom: 0.5rem;
}
</style>
