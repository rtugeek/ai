import type { RouteRecordRaw } from 'vue-router'
import MindMapWidget from './MindMap.widget'

const path = MindMapWidget.path
const name = MindMapWidget.name

const MindMapWidgetRoutes: RouteRecordRaw[] = [
  {
    path,
    name: `${name}`,
    component: () => import('./MindMapWidgetView.vue'),
  },
]

export default MindMapWidgetRoutes
