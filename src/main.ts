import { createApp } from 'vue'
import { WidgetJsPlugin } from '@widget-js/vue3'
import App from './App.vue'
import router from './router'
import '@widget-js/vue3/dist/style.css'
import '@widget-js/vue3/dist/mingcute_icon/MingCute.css'
import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

NProgress.configure({ trickle: false })

createApp(App).use(WidgetJsPlugin).use(router).mount('#app')
