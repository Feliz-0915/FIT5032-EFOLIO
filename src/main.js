import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCsuvtM7mTX4zsAsrDIuMwu0YLA1luPwjQ",
  authDomain: "week7-tianyang.firebaseapp.com",
  projectId: "week7-tianyang",
  storageBucket: "week7-tianyang.appspot.com",
  messagingSenderId: "559113398195",
  appId: "1:559113398195:web:795c8efb96334759830dc6"
};

initializeApp(firebaseConfig);  

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')
