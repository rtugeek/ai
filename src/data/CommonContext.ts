import { AppApi } from '@widget-js/core'
import md5 from 'md5'

export interface CommonContextOptions {
  content?: string
  extra?: string
  lang?: string
}

export class CommonContext {
  content?: string
  extra?: string
  lang?: string
  constructor(options: CommonContextOptions | string | undefined = undefined) {
    if (options) {
      if (typeof options == 'string') {
        this.content = options
      }
      else {
        this.content = options.content
        this.extra = options.extra
        if (options.lang) {
          this.lang = options.lang
        }
        else {
          AppApi.getLanguageCode().then(lang => lang || 'zh-CN')
        }
      }
    }
  }

  fullFill(prompt: string) {
    const assistantContent: string[] = []
    const newPrompt = prompt.replaceAll('@{content}', this.content || '')
      .replaceAll('@{extra}', this.extra || '')
    assistantContent.push(newPrompt)
    return assistantContent.join('\n')
  }

  getMD5(): string {
    return md5(`${this.content}-${this.extra}`)
  }
}
