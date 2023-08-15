import { post } from '@/utils/http'
import request from '@/utils/request'

const api = {
  // getCompanyDetail: '/manage/companyProfile/get', // 获取公司介绍详情
  // updateCompanyInfo: '/manage/companyProfile/update', // 修改公司介绍

  getCompanyDetail: '/api/v1/company/info', // 获取公司介绍详情
  updateCompanyInfo: '/api/v1/company/update', // 修改公司介绍

  // addClient: '/manage/cooperativeCustomers/insert', // 添加合作客户
  // deleteClient: '/manage/cooperativeCustomers/delete', //删除合作客户
  // getClientList: '/manage/cooperativeCustomers/list', //获取合作客户列表
  // updateClient: '/manage/cooperativeCustomers/update', // 修改合作客户

  getClientList: '/api/v1/file/list', //获取合作客户列表
  addClient: '/api/v1/file/insert', // 添加合作客户
  updateClient: '/api/v1/file/update', // 修改合作客户
  deleteClient: '/api/v1/file/delete', //删除合作客户

  // getMenuTree: '/manage/menu/tree', //获取菜单树
  // updateMenuTree: '/manage/menu/update', //更新菜单树
  // addMenu: '/manage/menu/insert', // 新增菜单
  // deleteMenu: '/manage/menu/delete', // 删除菜单

  getMenuTree: '/api/v1/menu/list', //获取菜单树
  updateMenuTree: '/api/v1/menu/update', //更新菜单树
  addMenu: '/api/v1/menu/insert', // 新增菜单
  deleteMenu: '/api/v1/menu/delete', // 删除菜单
  classifyMenu: '/api/v1/menu/classify', // 删除菜单
  



  // deleteInformation: '/manage/dataDown/delete', //删除资料
  // addInformation: '/manage/dataDown/insert', //新增资料
  // getInformation: '/manage/dataDown/list', // 查询资料
  // updateInformation: '/manage/dataDown/update', //更新资料

  getInformation: '/api/v1/file/list', // 查询资料
  addInformation: '/api/v1/file/insert', //新增资料
  updateInformation: '/api/v1/file/update', //更新资料
  deleteInformation: '/api/v1/file/delete', //删除资料


  // getNewsList: '/manage/news/list', //新闻列表
  // addNews: '/manage/news/insert', // 新增新闻
  // updateNews: '/manage/news/update', //修改新闻
  // deleteNews: '/manage/news/delete', // 删除新闻

  getNewsList: '/api/v1/news/list', //新闻列表
  addNews: '/api/v1/news/insert', // 新增新闻
  updateNews: '/api/v1/news/update', //修改新闻
  deleteNews: '/api/v1/news/delete', // 删除新闻



  // addProduct: '/manage/product/insert', // 新增产品
  // deleteProduct: '/manage/product/delete', // 删除产品
  // getProductList: '/manage/product/list', // 查询产品
  // updateProduct: '/manage/product/update', // 更新产品

  getProductImgs: '/manage/productImage/getProductImage', // 查询产品图片
  deleteProductImgs: '/manage/productImage/delete', //删除产品图片

  getProductList: '/api/v1/goods/list', // 查询产品
  addProduct: '/api/v1/goods/insert', // 新增产品
  updateProduct: '/api/v1/goods/update', // 更新产品
  deleteProduct: '/api/v1/goods/delete', // 删除产品


  // deleteUser: '/manage/user/delete', //删除用户
  // addUser: '/manage/user/insert', // 新增用户
  // getUserList: '/manage/user/list', // 用户列表
  // resetUserPassword: '/manage/user/resetPassword', //重置密码
  // updateUser: '/manage/user/update', // 修改用户
  // updateUserPassword: '/manage/user/updatePassword', // 修改密码

  updateUserPassword: '/api/v1/user/edit_password', // 修改密码
  deleteUser: '/api/v1/user/delete', //删除用户
  addUser: '/api/v1/user/insert', // 新增用户
  getUserList: '/api/v1/user/list', // 用户列表
  resetUserPassword: '/api/v1/user/resetPassword', //重置密码
  updateUser: '/api/v1/user/update', // 修改用户

  


  // getHomePageList: '/manage/homeImage/list', // 获取首页
  // updateHOmePageList: '/manage/homeImage/update', // 修改首页
  // addHomePageInfo: '/manage/homeImage/insert', // 新增首页
  // deleteHomPageInfo: '/manage/homeImage/delete', // 删除第一屏的轮播图

  getHomePageList: '/api/v1/home/list', // 获取首页
  updateHOmePageList: '/api/v1/home/update', // 修改首页
  addHomePageInfo: '/api/v1/home/insert', // 新增首页
  deleteHomPageInfo: '/api/v1/home/delete', // 删除第一屏的轮播图

  // getVideoList: '/manage/video/list', //获取视频列表
  // addVideoItem: '/manage/video/insert', // 新增视频
  // updateVideoItem: '/manage/video/update', //修改视频
  // deleteVideoItem: '/manage/video/delete', // 删除视频

  getVideoList: '/api/v1/video/list', //获取视频列表
  addVideoItem: '/api/v1/video/insert', // 新增视频
  updateVideoItem: '/api/v1/video/update', //修改视频
  deleteVideoItem: '/api/v1/video/delete', // 删除视频
}

export default api
// get使用params,post使用data
export function getCompanyDetail(params) {
  return request({
    url: api.getCompanyDetail,
    method: 'get',
    params: params
  })
}
export function updateCompanyInfo(params) {
  return request({
    url: api.updateCompanyInfo,
    method: 'post',
    data: params
  })
}
export function addClient(params) {
  return request({
    url: api.addClient,
    method: 'post',
    data: params
  })
}
export function deleteClient(params) {
  return request({
    url: api.deleteClient,
    method: 'post',
    data: params
  })
}
export function updateClient(params) {
  return request({
    url: api.updateClient,
    method: 'post',
    data: params
  })
}
export function getClientList(params) {
  return request({
    url: api.getClientList,
    method: 'post',
    data: params
  })
}
export function getMenuTree(params) {
  return request({
    url: api.getMenuTree,
    method: 'post',
    data: params
  })
}
export function updateMenuTree(params) {
  return request({
    url: api.updateMenuTree,
    method: 'post',
    data: params
  })
}
export function addMenu(params) {
  return request({
    url: api.addMenu,
    method: 'post',
    data: params
  })
}

export function deleteInformation(params) {
  return request({
    url: api.deleteInformation,
    method: 'post',
    data: params
  })
}
export function addInformation(params) {
  return request({
    url: api.addInformation,
    method: 'post',
    data: params
  })
}
export function getInformation(params) {
  return request({
    url: api.getInformation,
    method: 'post',
    data: params
  })
}
export function updateInformation(params) {
  // return post(api.updateInformation, params)

  return request({
    url: api.updateInformation,
    method: 'post',
    data: params
  })
}
export function deleteNews(params) {
  return request({
    url: api.deleteNews,
    method: 'post',
    data: params
  })
}
export function addNews(params) {
  return request({
    url: api.addNews,
    method: 'post',
    data: params
  })
}
export function getNewsList(params) {
  return request({
    url: api.getNewsList,
    method: 'post',
    data: params
  })
}
export function updateNews(params) {
  return request({
    url: api.updateNews,
    method: 'post',
    data: params
  })
}
export function addProduct(params) {
  return request({
    url: api.addProduct,
    method: 'post',
    data: params
  })
}
export function deleteProduct(params) {
  return request({
    url: api.deleteProduct,
    method: 'post',
    data: params
  })
}
export function getProductList(params) {
  return request({
    url: api.getProductList,
    method: 'post',
    data: params
  })
}
export function updateProduct(params) {
  return request({
    url: api.updateProduct,
    method: 'post',
    data: params
  })
}
export function getProductImgs(params) {
  return request({
    url: api.getProductImgs,
    method: 'post',
    data: params
  })
}
export function deleteProductImgs(params) {
  return request({
    url: api.deleteProductImgs,
    method: 'post',
    data: params
  })
}

export function deleteUser(params) {
  return request({
    url: api.deleteUser,
    method: 'post',
    data: params
  })
}
export function addUser(params) {
  return request({
    url: api.addUser,
    method: 'post',
    data: params
  })
}
export function getUserList(params) {
  return request({
    url: api.getUserList,
    method: 'post',
    data: params
  })
}
export function resetUserPassword(params) {
  return request({
    url: api.resetUserPassword,
    method: 'post',
    data: params
  })
}
export function updateUser(params) {
  return request({
    url: api.updateUser,
    method: 'post',
    data: params
  })
}
export function updateUserPassword(params) {
  return request({
    url: api.updateUserPassword,
    method: 'post',
    data: params
  })
}
export function deleteMenu(params) {
  return request({
    url: api.deleteMenu,
    method: 'post',
    data: params
  })
}

export function classifyMenu(params) {
  return request({
    url: api.classifyMenu,
    method: 'post',
    data: params
  })
}

export function getHomePageList(params) {
  return request({
    url: api.getHomePageList,
    method: 'post',
    data: params
  })
}
export function updateHOmePageList(params) {
  return request({
    url: api.updateHOmePageList,
    method: 'post',
    data: params
  })
}
export function addHomePageInfo(params) {
  return request({
    url: api.addHomePageInfo,
    method: 'post',
    data: params
  })
}
export function deleteHomPageInfo(params) {
  return request({
    url: api.deleteHomPageInfo,
    method: 'post',
    data: params
  })
}
export function getVideoList(params) {
  return request({
    url: api.getVideoList,
    method: 'post',
    data: params
  })
}
export function addVideoItem(params) {
  return request({
    url: api.addVideoItem,
    method: 'post',
    data: params
  })
}
export function updateVideoItem(params) {
  return request({
    url: api.updateVideoItem,
    method: 'post',
    data: params
  })
}
export function deleteVideoItem(params) {
  return request({
    url: api.deleteVideoItem,
    method: 'post',
    data: params
  })
}
