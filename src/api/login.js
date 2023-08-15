import request from '@/utils/request'


const userApi = {
  Login: '/api/v1/user/login',
  // Login:'http://127.0.0.1:7001/api/v1/user/login',
  Logout: '/logout',
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export async function login(params) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: params
  })
}
export function logout() {
  return new Promise((resolve, reject) => {
    resolve({ code: 0 })
  })

  // return request({
  //   url: userApi.Logout,
  //   method: 'post',
  // })
}

export function getSmsCaptcha() {

}
