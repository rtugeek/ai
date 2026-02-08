import { AiApi, AiApiEvent, AppApi } from '@widget-js/core'
import { AiChatApi, type AiConfig } from '@widget-js/ai-component'
import { nextTick, onMounted, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useAppBroadcast } from '@widget-js/vue3'
import { log } from 'mermaid/dist/logger'

export function useRouteAiConfig() {
  const config = reactive<AiConfig>({ apiKey: '', model: '', url: '' })

  function openSetting() {
    AppApi.showAppWindow('setting?tab=ai', {})
  }

  function check() {
    if (!config.apiBaseUrl && !config.apiKey) {
      ElMessageBox.confirm(
        '检测到您尚未配置 AI API Key，请先完成配置。',
        '提示',
        {
          confirmButtonText: '去设置',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          openSetting()
        })
        .catch(() => {
        })
      return false
    }
    return true
  }

  async function updateConfig() {
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
  }
  onMounted(async () => {
    await nextTick()
    updateConfig()
  })

  useAppBroadcast([AiApiEvent.CONFIG_UPDATED], (event) => {
    if (event.event == AiApiEvent.CONFIG_UPDATED) {
      updateConfig()
    }
  })
  return { config, check }
}
