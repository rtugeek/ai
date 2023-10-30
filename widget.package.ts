import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  name: 'cn.widgetjs.widgets.ai.assistant',
  author: 'Neo Fu',
  homepage: 'https://widgetjs.cn',
  description: {
    'zh-CN': 'ChatGPT助手'
  },
  remote: {
    entry: 'https://rtugeek.gitee.io/ai',
    hash: true,
    base: '/ai',
  },
  remoteEntry: 'https://rtugeek.gitee.io/ai',
  remotePackage: 'https://rtugeek.gitee.io/ai/widget.json',
  entry: 'index.html',
  title: { 'zh-CN': '一键呼出ChatGPT' },
  version: '0.0.1',
  hash: true,
  devOptions: {
    folder: './src/widgets/',
    route: true,
    devUrl: 'http://localhost:5174/ai'
  },
  widgets: [],
  permissions: []
})
