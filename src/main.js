import ElementPlus from 'element-plus'
import zhTW from 'element-plus/es/locale/lang/zh-tw'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import 'element-plus/dist/index.css'
import 'virtual:uno.css'



const app = createApp(App)
app.use(ElementPlus, {
    locale: zhTW,
  })
app.use(createPinia())
app.use(router)
app.mount('#app')
