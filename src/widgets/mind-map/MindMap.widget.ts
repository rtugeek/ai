import { Widget, WidgetKeyword } from '@widget-js/core';
//TODO 修改组件信息，标题，描述，关键词
const MindMapWidget = new Widget({
  name: 'cn.widgetjs.widgets.ai.assistant.mind_map',
  title: { 'zh-CN': '思维导图' },
  description: { 'zh-CN': '' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: [],
  lang: 'zh-CN',
  width: 2,
  height: 2,
  minWidth: 2,
  maxWidth: 2,
  minHeight: 2,
  maxHeight: 2,
  previewImage: '修改为组件预览图地址',
  path: '/widget/mind_map',
  configPagePath:
    '/widget/config/mind_map?width=600&height=500&frame=true&transparent=false',
});

export default MindMapWidget;
