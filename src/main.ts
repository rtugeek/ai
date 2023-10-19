import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {WidgetJsPlugin} from "@widget-js/vue3";
import '@widget-js/vue3/dist/style.css'
import '@widget-js/vue3/dist/mingcute_icon/MingCute.css'
import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css';
createApp(App).use(WidgetJsPlugin).use(router).mount('#app')

