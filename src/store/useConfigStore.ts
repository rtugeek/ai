import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { AiConfig } from '@/widgets/ai/AiConfig'
import { DEFAULT_CONFIG } from '@/widgets/ai/AiConfig'

export type WindowPosition = 'left' | 'right'
export function useConfig() {
  const config = useStorage<AiConfig>('config', DEFAULT_CONFIG)
  const position = useStorage<WindowPosition>('window-position', 'right')
  const proxyRule = computed(() => {
    if (hasProxyRule.value) {
      return `${config.value.protocol}://${config.value.host}:${config.value.port}`
    }
    else {
      return ''
    }
  })

  const hasProxyRule = computed(() => {
    return !!(config.value.protocol && config.value.host && config.value.port)
  })

  const platformUrl = computed(() => {
    if (config.value.platform === 'chatgpt') {
      return 'https://chat.openai.com'
    }
    else if (config.value.platform === 'gemini') {
      return 'https://gemini.google.com'
    }
    else {
      return 'https://chat.deepseek.com/'
    }
  })
  return { config, position, hasProxyRule, proxyRule, platformUrl }
}
