
import request from '@/utils/request'

const api = {
  uploadFile: '/api/upload',
  deleteFile: '/fileDelete'
}

export default api

export function uploadFile(params) {
  return request({
    url: api.uploadFile,
    method: 'post',
    data: params,
    headers: {
      // "Authorization": "Basic " + auth,
      'Content-Type': 'multipart/form-data'
    },
  })
}
export function deleteFile(params) {
  return request({
    url: api.deleteFile,
    method: 'post',
    params: params
  })
}
