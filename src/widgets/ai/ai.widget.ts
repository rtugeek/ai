import { BackgroundWidget, DeployMode, WidgetKeyword } from '@widget-js/core'

const AiWidget = new BackgroundWidget({
  path: '/widget/chatgpt',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
  name: '.chatgpt',
  title: { 'zh-CN': 'AI助手', 'en-US': 'AI Assistant' },
  description: { 'zh-CN': '一键呼出DeepSeek、Kimi、豆包等AI服务', 'en-US': 'Call DeepSeek, ChatGPT, Gemini with shortcut' },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  categories: ['productivity', 'ai'],
  previewImage: '/preview_ai.png',
  maxHeight: 15,
  socialLinks: [
    {
      name: 'github',
      link: 'https://github.com/rtugeek/ai',
    },
  ],
  webviewTag: true,
  browserWindowOptions: {
    webviewTag: true,
  },
  supportDeployMode: DeployMode.BACKGROUND,
})

export default AiWidget
