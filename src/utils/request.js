import axios from 'axios'
import store from '@/store'
import router from '@/router/index'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: 'http://127.0.0.1:7001',
  // baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  // baseURL:'',
  timeout: 10000 // 请求超时时间
})
axios.defaults.withCredentials = true   // 允许跨域携带cookie

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401) {
      notification.error({
        message: '登录过期',
        description: '请重新登录'
      })
      storage.clearAll()
      router.replace({ path: '/user/login' })
      location.reload()
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get('token')
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'bearer ' + token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {

  // 需要先判断status为200，才正常返回
  if (response.status == 200) {                // 外部返回的状态码
    return response.data
  } else {
    return Promise.reject(response.statusText);
  }

}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
