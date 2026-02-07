import { AiApi } from '@widget-js/core'
import { AiChatApi, type AiConfig } from '@widget-js/ai-component'
import { nextTick, onMounted, reactive } from 'vue'

export function useRouteAiConfig() {
  const config = reactive<AiConfig>({ apiKey: '', model: '', url: '' })

  onMounted(async () => {
    await nextTick()
    try {
      const aiConfigs = await AiApi.getConfigList()
      if (aiConfigs.length > 0) {
        const aiConfig = aiConfigs[0]
        config.apiKey = aiConfig.apiKey
        config.model = aiConfig.model
        config.apiBaseUrl = aiConfig.apiBaseUrl
        AiChatApi.updateConfig(config)
      }
    }
    catch (e) {
      console.error(e)
    }
  })
  return { config }
}
