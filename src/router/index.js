import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "login" */'../views/home')
    },
    {
      path: '/fight',
      name: 'fight',
      component: () => import(/* webpackChunkName: "grid" */'../views/layout-fight')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import(/* webpackChunkName: "preview" */'../views/layout-preview')
    }
  ]
})
