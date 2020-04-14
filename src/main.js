import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './components/a-ui'
import './assets/less/index.less'
import sound from './sound'

Vue.prototype.$sound = sound

// window.onunhandledrejection = (e) => console.log(e)

let s = window.screen.width / 1920
document.body.style.zoom = s

window.loginTip = true

window.app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
