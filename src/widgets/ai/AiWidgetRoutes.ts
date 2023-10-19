import AiWidgetDefine from "./ai.widget";


const url = AiWidgetDefine.path;
const name = AiWidgetDefine.name;
const configUrl = AiWidgetDefine.configPagePath;
const AiWidgetRoutes = [
    {
        path: url,
        name: `${name}`,
        component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search" */ './AiWidgetView.vue')
    },
    {
        path: configUrl,
        name: `${name}.config`,
        component: () => import(/* webpackChunkName: "com.wisdom.widgets.chatgpt_search.config" */ './AiConfigView.vue')
    }
]


export default AiWidgetRoutes;
