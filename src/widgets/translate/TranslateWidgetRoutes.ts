import type { RouteRecordRaw } from 'vue-router'
import TranslateWidget from './Translate.widget'

const path = TranslateWidget.path
const name = TranslateWidget.name

const TranslateWidgetRoutes: RouteRecordRaw[] = [
  {
    path,
    name: `${name}`,
    component: () => import('./TranslateWidgetView.vue'),
  },
]

export default TranslateWidgetRoutes
