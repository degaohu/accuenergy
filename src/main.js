import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';


const app = createApp(App)

const loaderInstance  = new Loader({
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY, // 替换为你的 Google Maps API 密钥
  version: 'weekly', // 指定要加载的 Google Maps API 版本
  libraries: ["places"]
});

//app.config.globalProperties.$loader = loader;




// app.use(store).use(router).use(ElementPlus).mount('#app')




app.use(store).use(router).use(ElementPlus).use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: "places"
  }
});



app.config.globalProperties.$http = axios;
app.config.globalProperties.$loaderInstance = loaderInstance;



app.mount('#app');



for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
