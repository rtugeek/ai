import type { AiPlatform } from '@/utils/AiUtils'

export type ProxyProtocol = 'http' | 'https' | 'sock5' | 'sock4'

export interface AiConfig {
  proxy?: string
  shortcut: string
  protocol?: ProxyProtocol
  port?: string
  platform: AiPlatform
  host?: string
}

export const DEFAULT_CONFIG: AiConfig = {
  shortcut: 'Meta+Alt+C',
  platform: 'deepseek',
}
