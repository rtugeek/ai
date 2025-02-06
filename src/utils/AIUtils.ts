import type { AIPlatform } from '@/widgets/ai/AiConfig'

export class AIUtils {
  static getUrl(platform: AIPlatform) {
    if (platform === 'chatgpt') {
      return 'https://chat.openai.com'
    }
    else if (platform === 'gemini') {
      return 'https://gemini.google.com'
    }
    else {
      return 'https://chat.deepseek.com/'
    }
  }
}
