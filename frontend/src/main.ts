import { createApp } from 'vue'
import 'vuetify/dist/vuetify.min.css' // Ensure you are importing Vuetify CSS
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from "./router.ts";
import './style.css'
import App from './App.vue'
import { createVuetify } from 'vuetify'

const app = createApp(App)

const vuetify = createVuetify({
    components,
    directives
})

app.use(vuetify)

app.use(router).mount('#app')
