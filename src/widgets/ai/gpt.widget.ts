import { BackgroundWidget, DeployMode, WidgetKeyword } from '@widget-js/core'

const AiWidget = new BackgroundWidget({
  path: '/widget/chatgpt',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
  name: '.chatgpt',
  title: { 'zh-CN': 'AI助手' },
  description: { 'zh-CN': '支持一件呼出ChatGPT或Gemini' },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  categories: ['productivity'],
  previewImage: '/chatgpt.png',
  maxHeight: 15,
  webviewTag: true,
  browserWindowOptions: {
    webviewTag: true,
  },
  supportDeployMode: DeployMode.BACKGROUND,
})

export default AiWidget
