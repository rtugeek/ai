import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  name: 'cn.widgetjs.widgets.ai.assistant',
  author: 'Neo Fu',
  homepage: 'https://widgetjs.cn',
  description: {
    'zh-CN': '一键呼出DeepSeek、Kimi、豆包、Grok等AI服务',
  },
  remote: {
    entry: 'https://widgetjs.cn/ai',
    hash: true,
    base: '/ai',
    hostname: 'widgetjs.cn',
  },
  zipUrl: 'https://widgetjs.cn/ai/widget.zip',
  remoteEntry: 'https://widgetjs.cn/ai',
  remotePackage: 'https://widgetjs.cn/ai/widget.json',
  entry: 'index.html',
  title: { 'zh-CN': 'AI助手' },
  hash: true,
  devOptions: {
    folder: './src/widgets/',
    route: true,
    devUrl: 'http://localhost:5174/ai',
  },
  widgets: [],
  permissions: [],
})
