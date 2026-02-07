import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const MermaidWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.ai.assistant.mermaid',
  title: { 'zh-CN': 'Mermaid图表', 'en-US': 'Mermaid Chart' },
  description: { 'zh-CN': '根据Mermaid语法生成图表', 'en-US': 'Generate charts using Mermaid syntax' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: ['ai', 'utilities'],
  lang: 'zh-CN',
  browserWindowOptions: {
    width: 800,
    height: 600,
    frame: true,
    titleBarStyle: 'hidden',
    transparent: false,
    skipTaskbar: false,
  },
  previewImage: '修改为组件预览图地址',
  path: '/widget/mermaid',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
})

export default MermaidWidget
