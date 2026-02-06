import type { AiConfig } from '@widget-js/ai-component'
import { AiChatApi } from '@widget-js/ai-component'
import { ElNotification } from 'element-plus'
import { nextTick, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

/**
 * apiKey=sk-eb2f614b325a46e38ad88d2a11cdbbe2&apiBaseUrl=https://dashscope.aliyuncs.com/compatible-mode/v1&model=qwen-plus&content=代码
 */
export function useRouteAiConfig() {
  const route = useRoute()
  const config = reactive<AiConfig>({ apiKey: '', model: '', url: '' })
  config.apiKey = route.query.apiKey as string
  config.model = route.query.model as string
  config.url = route.query.apiBaseUrl as string
  config.temperature = route.query.temperature ? Number.parseFloat(route.query.temperature as string) : undefined
  config.maxTokens = route.query.maxTokens ? Number.parseInt(route.query.maxTokens as string) : undefined
  try {
    AiChatApi.updateConfig(config)
  }
  catch (e) {
    console.error(e)
  }
  onMounted(async () => {
    await nextTick()
    if (!config.url || !config.apiKey) {
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
  return { config }
}
