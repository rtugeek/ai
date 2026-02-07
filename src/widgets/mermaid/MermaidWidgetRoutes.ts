import type { RouteRecordRaw } from 'vue-router'
import MermaidWidget from './Mermaid.widget'

const path = MermaidWidget.path
const name = MermaidWidget.name

const MermaidWidgetRoutes: RouteRecordRaw[] = [
  {
    path,
    name: `${name}`,
    component: () => import('./MermaidWidgetView.vue'),
  },
]

export default MermaidWidgetRoutes
