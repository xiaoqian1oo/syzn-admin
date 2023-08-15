import axios from 'axios';
import storage from 'store'

const errNum = 0;
// 配置新建一个 axios 实例
const service = axios.create({
  // baseURL: import.meta.env.MODE == 'development' ? '' : (import.meta.env.VITE_API_URL || ''),
  // timeout: import.meta.env.MODE == 'development' ? 20000 : 30000,
  baseURL: 'http://localhost:7001',
  headers: { 'Content-Type': 'application/json' },
  // 请求超时再次发起请求处理,设置全局的请求次数，请求的间隙
  retry: 2,       // 第一次请求失败后重试请求的次数。
  retryDelay: 500,   // 在失败的请求之间等待的毫秒数（默认为 1）
});

// 添加请求拦截器
service.interceptors.request.use((config) => {

  // 在发送请求之前做些什么 token
  // const token = Session.get('token');
  // if (token) {
  //     (<any>config.headers).common['Authorization'] = `${token}`;
  // }

  const token = storage.get('token')
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['token'] = token
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response) => {
  // 对响应数据做点什么
  // 需要先判断status为200，才正常返回
  if (response.status == 200) {                // 外部返回的状态码
    console.log('response :>> ', response);
    return response.data
  } else {
    return Promise.reject(response.statusText);
  }
}, async (error) => {
  // 对响应错误做点什么
  // if (error.message.indexOf('timeout') != -1) {
  //     ElMessage.error('网络超时');
  // } else if (error.message == 'Network Error') {
  //     ElMessage.error('网络连接错误');
  // } else {
  //     ElMessage.error(error.response.status + ',' + error.response.statusText);
  //     //    if (error.response.data)  else ElMessage.error('接口路径找不到');
  // }
  // return Promise.reject(error);

  // 请求超时处理 https://github.com/axios/axios/issues/164#issuecomment-327837467
  const config = error.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(error);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    if (error.message.indexOf('timeout') != -1) {
      // ElMessage.error('网络超时');
      this.$notification['error']({
        message: '错误',
        description: '网络超时',
        duration: 4,
      })
    } else if (error.message == 'Network Error') {
      this.$notification['error']({
        message: '错误',
        description: '网络连接错误',
        duration: 4,
      })
      // ElMessage.error('网络连接错误');
    } else {
      this.$notification['error']({
        message: '错误',
        description: error.response.status + ',' + error.response.statusText,
        duration: 4,
      })
      // ElMessage.error(error.response.status + ',' + error.response.statusText);
      //    if (error.response.data)  else ElMessage.error('接口路径找不到');
    }
    return Promise.reject(error);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backOff
  const backOff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve(1);
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backOff.then(function () {
    return service(config);
  });

});


/*** 方法封装 **********************************/
/**
 * @method post请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const post = (url, data, config) => {
  // return service.get(url, {
  //     params: data,
  //     ...config
  // })
  return service.post(url, data, { ...config })
}

/**
 * @method get请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const get = (url, data, config) => {
  return service.get(url, {
    params: data,
    ...config
  })
}

/**
 * @method del删除
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const del = (url, data, config) => {
  return service.delete(url, {
    params: data,
    ...config
  })
}
/**
 * @method put请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {Promise<ResponseData<T>>}
 */
const put = (url, data, config) => {
  return service.put(url, data, { ...config })
}

// 导出 axios 实例
export { post, get, del, put, service as request }

// export default service;
