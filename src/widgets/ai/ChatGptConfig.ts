export type ProxyProtocol = 'http' | 'https' | 'sock5' | 'sock4'
export type AIPlatform = 'chatgpt' | 'gemini'
export interface ChatGptConfig {
  proxy?: string
  shortcut: string
  protocol?: ProxyProtocol
  port?: string
  platform: AIPlatform
  host?: string
}

export const DEFAULT_CONFIG: ChatGptConfig = {
  shortcut: 'Meta+Alt+C',
  platform: 'chatgpt',
}
