import { createApp } from 'vue'
import { WidgetJsPlugin } from '@widget-js/vue3'
import NProgress from 'nprogress'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@widget-js/vue3/dist/style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@icon-park/vue-next/styles/index.css'
import 'nprogress/nprogress.css'
import 'virtual:uno.css'
import { i18n } from '@/i18n'

NProgress.configure({ trickle: false })

createApp(App)
  .use(i18n)
  .use(createPinia()).use(WidgetJsPlugin).use(router).mount('#app')
