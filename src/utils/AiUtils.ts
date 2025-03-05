import DouBao from '@/assets/dou_bao.png'
import Qwen from '@/assets/qwen.png'
import DeepSeek from '@/assets/deepseek.png'
import Gemini from '@/assets/google-gemini-icon.png'
import ChatGpt from '@/assets/chatgpt-icon.png'
import YuanBao from '@/assets/yuanbao.png'
import Kimi from '@/assets/kimi.png'

export type AiPlatform = 'deepseek' | 'chatgpt' | 'gemini' | 'kimi' | 'qwen' | 'dou_bao' | 'yuan_bao'
export interface AiService {
  name: string
  value: AiPlatform
  url: string
  logo: string
}

export class AiUtils {
  static readonly chinaAiServices: AiService[] = [{
    name: 'DeepSeek',
    value: 'deepseek',
    logo: DeepSeek,
    url: 'https://chat.deepseek.com',
  }, {
    name: 'kimi',
    value: 'kimi',
    logo: Kimi,
    url: 'https://kimi.moonshot.cn/',
  }, {
    name: '通义千问',
    value: 'qwen',
    logo: Qwen,
    url: 'https://tongyi.aliyun.com/',
  }, {
    name: '豆包',
    logo: DouBao,
    value: 'dou_bao',
    url: 'https://www.doubao.com/chat/',
  }, {
    name: '元宝',
    logo: YuanBao,
    value: 'yuan_bao',
    url: 'https://yuanbao.tencent.com/chat/',
  }]

  static readonly usAiServices: AiService[] = [{
    name: 'ChatGPT',
    value: 'chatgpt',
    logo: ChatGpt,
    url: 'https://chatgpt.com/',
  }, {
    name: 'Gemini',
    value: 'gemini',
    logo: Gemini,
    url: 'https://gemini.google.com/',
  }]

  static readonly aiServices: AiService[] = AiUtils.chinaAiServices.concat(AiUtils.usAiServices)

  static getUrl(platform: AiPlatform): string {
    return AiUtils.aiServices.find(service => service.value === platform)?.url ?? this.chinaAiServices[0].url
  }

  static get(platform?: AiPlatform | number): AiService {
    if (typeof platform === 'number') {
      return AiUtils.aiServices[platform] ?? this.chinaAiServices[0]
    }
    return AiUtils.aiServices.find(service => service.value === platform) ?? this.chinaAiServices[0]
  }

  static getLogo(platform: AiPlatform): string {
    return AiUtils.aiServices.find(service => service.value === platform)?.logo ?? this.chinaAiServices[0].logo
  }
}
