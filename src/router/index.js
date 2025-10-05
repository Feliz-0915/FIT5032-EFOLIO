import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView, alias: ['/firelogin', '/login'] },
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView, alias: ['/fireregister', '/register'] },
  { path: '/Logout', name: 'Logout', component: FirebaseLogoutView, alias: ['/logout'] },
  { path: '/addbook', name: 'AddBook', component: AddBookView, alias: ['/AddBook', '/addBook'] },
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/GetBookCount', name: 'GetBookCount', component: GetBookCountView}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router