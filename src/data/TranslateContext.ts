import type { CommonContextOptions } from '@/data/CommonContext'
import { CommonContext } from '@/data/CommonContext'
import md5 from 'md5'

export interface TranslateContextOptions extends CommonContextOptions {
  firstLang?: string
  secondLang?: string
}
export class TranslateContext extends CommonContext {
  firstLang: string
  secondLang: string

  constructor(options: TranslateContextOptions) {
    super(options)
    this.firstLang = options.firstLang ?? 'zh'
    this.secondLang = options.secondLang ?? 'en'
  }

  fullFill(prompt: string): string {
    const str = super.fullFill(prompt)
    return str.replaceAll('{{firstLang}}', this.firstLang)
      .replaceAll('{{secondLang}}', this.secondLang)
  }

  getMD5(): string {
    return md5(`${this.content}-${this.extra}-${this.firstLang}-${this.secondLang}`)
  }
}
