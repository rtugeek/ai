import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { AIPlatform, AiConfig } from '@/widgets/ai/AiConfig'
import { DEFAULT_CONFIG } from '@/widgets/ai/AiConfig'
import { AIUtils } from '@/utils/AIUtils'

export type WindowPosition = 'left' | 'right'
export const useConfigStore = defineStore('config', () => {
  const config = useStorage<AiConfig>('config', DEFAULT_CONFIG)
  const platforms = useStorage<AIPlatform[]>('platforms', ['deepseek'])
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

  const platformUrlList = computed(() => {
    return platforms.value.map(platform => AIUtils.getUrl(platform))
  })
  return { config, position, hasProxyRule, platforms, proxyRule, platformUrlList }
})
