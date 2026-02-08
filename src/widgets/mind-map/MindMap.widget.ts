import { BackgroundWidget, Widget, WidgetKeyword } from '@widget-js/core'

const MindMapWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.ai.assistant.mind_map',
  title: { 'zh-CN': '思维导图', 'en-US': 'Mind Map' },
  description: { 'zh-CN': '根据关键词生成思维导图', 'en-US': 'Generate a mind map based on keywords' },
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
  previewImage: '/preview_mindmap.png',
  path: '/widget/mind_map',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
})

export default MindMapWidget
