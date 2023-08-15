// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import cropperImage from '@/components/CropperImage'
import {
  tree,
  FormModel,
  autoComplete,
  mentions,
  pagination,
  empty,
  collapse,
  rate,
  treeSelect,
  transfer,
  DatePicker,
  Cascader,
  timeline,
  BackTop
} from 'ant-design-vue'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import './assets/main.css'
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(FormModel)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('a-tree', tree)
Vue.component('a-mentions', mentions)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('a-auto-complete', autoComplete)
Vue.component('a-pagination', pagination)
Vue.component('a-empty', empty)
Vue.component('a-collapse', collapse)
Vue.component('a-collapse-panel', collapse.Panel)
Vue.component('a-rate', rate)
Vue.component('a-tree-select', treeSelect)
Vue.component('a-transfer', transfer)
Vue.component('a-date-picker', DatePicker)
Vue.component('a-cascader', Cascader)
Vue.component('a-timeline', timeline)
Vue.component('a-timeline-item', timeline.Item)
Vue.component('a-back-top', BackTop)
Vue.component('a-cropper', cropperImage)
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
