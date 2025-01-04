import AiWidget from './ai.widget'

const url = AiWidget.path
const name = AiWidget.name
const configUrl = AiWidget.configPagePath?.split('?')[0]
const AiWidgetRoutes = [
  {
    path: url,
    name: `${name}`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search" */ './AiWidgetView.vue'),
  },
  {
    path: configUrl,
    name: `${name}.config`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search.config" */ './AiConfigView.vue'),
  },
]

export default AiWidgetRoutes
