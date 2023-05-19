import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'
const app = createApp(App)


app.use(store).use(router).use(ElementPlus).use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBKLrJ2T-kU96j3yC2VqArY0B1Ap9dU7UE",
    libraries: "places"
  }
}).mount('#app')




for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
