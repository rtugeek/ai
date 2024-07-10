import GptWidgetDefine from './gpt.widget'

const url = GptWidgetDefine.path
const name = GptWidgetDefine.name
const configUrl = GptWidgetDefine.configPagePath?.split('?')[0]
const ChatGptWidgetRoutes = [
  {
    path: url,
    name: `${name}`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search" */ './ChatGptWidgetView.vue'),
  },
  {
    path: configUrl,
    name: `${name}.config`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search.config" */ './ChatGptConfigView.vue'),
  },
]

export default ChatGptWidgetRoutes
