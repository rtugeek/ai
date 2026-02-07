import { BackgroundWidget, Widget, WidgetKeyword } from '@widget-js/core'

const MindMapWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.ai.assistant.mind_map',
  title: { 'zh-CN': '思维导图' },
  description: { 'zh-CN': '' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: [],
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
  path: '/widget/mind_map',
  configPagePath: '/widget/config/chatgpt?frame=true&transparent=false',
})

export default MindMapWidget
