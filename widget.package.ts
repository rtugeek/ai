import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  name: 'cn.widgetjs.widgets.ai.assistant',
  author: 'Widget JS',
  homepage: 'https://widgetjs.cn',
  description: {
    'zh-CN': 'AI助手'
  },
  entry: 'index.html',
  title: { 'zh-CN': 'AI助手' },
  version: '0.0.1',
  hash: true,
  devOptions: {
    folder: './src/widgets/',
    route: true,
    devUrl: 'http://localhost:5174'
  },
  widgets: [],
  permissions: []
})
