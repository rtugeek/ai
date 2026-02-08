import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const TranslateWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.ai.assistant.translate',
  title: { 'zh-CN': 'AI翻译', 'en-US': 'AI Translation' },
  description: { 'zh-CN': '使用AI翻译文本', 'en-US': 'Translate text using AI' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: ['ai', 'utilities'],
  lang: 'zh-CN',
  browserWindowOptions: {
    width: 800,
    height: 600,
    frame: true,
    center: true,
    titleBarStyle: 'hidden',
    transparent: false,
    skipTaskbar: false,
  },
  socialLinks: [
    {
      name: 'github',
      link: 'https://github.com/rtugeek/ai',
    },
  ],
  previewImage: '/preview_translate.png',
  path: '/widget/translate',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
})

export default TranslateWidget
