import { DeployMode, Widget, WidgetKeyword } from '@widget-js/core'

const name = 'cn.widgetjs.widgets.ai.assistant.chatgpt'
// 组件标题
const title = { 'zh-CN': 'AI助手' }
// 组件描述
const description = { 'zh-CN': 'AI助手' }
// 组件关键词
const keywords = [WidgetKeyword.RECOMMEND]
// 组件关键词
const AiWidgetDefine = new Widget({
  path: '/widget/chatgpt',
  configPagePath: '/widget/config/chatgpt',
  name,
  title,
  description,
  keywords,
  lang: 'zh-CN',
  width: 8,
  height: 8,
  minWidth: 5,
  maxWidth: 12,
  minHeight: 5,
  categories: ['productivity'],
  webviewTag: true,
  previewImage: '/chatgpt.png',
  maxHeight: 15,
  supportDeployMode: DeployMode.BACKGROUND,
  backgroundThrottling: false,
})

export default AiWidgetDefine
