import AiWidgetRoutes from './ai/AiWidgetRoutes'

import MindMapWidgetRoutes from './mind-map/MindMapWidgetRoutes'
import TranslateWidgetRoutes from './translate/TranslateWidgetRoutes'
import MermaidWidgetRoutes from "./mermaid/MermaidWidgetRoutes";
//FBI WANING! IMPORT PLACE, DONT DELETE THIS LINE

const WidgetRouter = [
  ...AiWidgetRoutes,
  ...MindMapWidgetRoutes,
  ...TranslateWidgetRoutes,
  ...MermaidWidgetRoutes,
    // FBI WANING! ROUTE PLACE, DONT DELETE THIS LINE
]
export default WidgetRouter
