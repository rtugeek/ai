import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { ChatGptConfig } from '@/widgets/ai/ChatGptConfig'
import { DEFAULT_CONFIG } from '@/widgets/ai/ChatGptConfig'

export function useConfig() {
  const config = useStorage<ChatGptConfig>('config', DEFAULT_CONFIG)
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
    return config.value.platform === 'chatgpt' ? 'https://chat.openai.com' : 'https://gemini.google.com'
  })
  return { config, hasProxyRule, proxyRule, platformUrl }
}
