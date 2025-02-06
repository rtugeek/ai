export type ProxyProtocol = 'http' | 'https' | 'sock5' | 'sock4'
export type AIPlatform = 'deepseek' | 'chatgpt' | 'gemini'
export interface AiConfig {
  proxy?: string
  shortcut: string
  protocol?: ProxyProtocol
  port?: string
  platform: AIPlatform
  host?: string
}

export const DEFAULT_CONFIG: AiConfig = {
  shortcut: 'Meta+Alt+C',
  platform: 'deepseek',
}
