import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const MermaidWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.ai.assistant.mermaid',
  title: { 'zh-CN': 'Mermaid图表', 'en-US': 'Mermaid Chart' },
  description: { 'zh-CN': '生成流程图、类图、甘特图、时序图等图表', 'en-US': 'Generate flowcharts, class diagrams, Gantt charts, sequence diagrams, etc.' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: ['ai', 'utilities'],
  lang: 'zh-CN',
  browserWindowOptions: {
    width: 800,
    height: 600,
    center: true,
    frame: true,
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
  previewImage: '/preview_mermaid.png',
  path: '/widget/mermaid',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
})

export default MermaidWidget
