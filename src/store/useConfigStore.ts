import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { AiConfig } from '@/widgets/ai/AiConfig'
import { DEFAULT_CONFIG } from '@/widgets/ai/AiConfig'
import type { AiPlatform } from '@/utils/AiUtils'
import { AiUtils } from '@/utils/AiUtils'

export type WindowPosition = 'left' | 'right'
export const useConfigStore = defineStore('config', () => {
  const config = useStorage<AiConfig>('config', DEFAULT_CONFIG)
  const platforms = useStorage<AiPlatform[]>('platforms', ['deepseek'])
  const position = useStorage<WindowPosition>('window-position', 'right')
  const tipProgress = useStorage('tip-progress-3', 0)
  const pageCount = useStorage<number>('page-count', 1)
  const alwaysTop = useStorage('always-top-1', true)
  const windowWidthRatio = useStorage<number>('window-width-percent', 0.3)
  const needShowTip = computed(() => {
    return tipProgress.value < 2
  })
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
    return platforms.value.map(platform => AiUtils.getUrl(platform))
  })
  return { config, position, tipProgress, needShowTip, alwaysTop, pageCount, windowWidthRatio, hasProxyRule, platforms, proxyRule, platformUrlList }
})
