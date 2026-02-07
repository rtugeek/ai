import AiWidgetRoutes from './ai/AiWidgetRoutes'

import MindMapWidgetRoutes from './mind-map/MindMapWidgetRoutes'
import TranslateWidgetRoutes from './translate/TranslateWidgetRoutes'
// FBI WANING! IMPORT PLACE, DONT DELETE THIS LINE

const WidgetRouter = [
  ...AiWidgetRoutes,
  ...MindMapWidgetRoutes,
  ...TranslateWidgetRoutes,
  // FBI WANING! ROUTE PLACE, DONT DELETE THIS LINE
]
export default WidgetRouter
