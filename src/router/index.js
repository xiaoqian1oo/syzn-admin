import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
const isProd = process.env.NODE_ENV === 'production'

export default new Router({
  base:  isProd ? '/syzn-admin/': '/',
  mode: 'history',
  routes: constantRouterMap.concat(asyncRouterMap)
})
