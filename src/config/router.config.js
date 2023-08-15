// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {title: '首页'},
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'HomePage',
        component: () => import(/* webpackChunkName: "News" */ '@/views/home-page'),
        meta: {title: '首页装修',icon: 'home'},
      },
      {
        path: '/news',
        name: 'News',
        component: () => import(/* webpackChunkName: "News" */ '@/views/news'),
        meta: {title: '新闻资讯',icon: 'sound'},
      },
      {
        path: '/product',
        name: 'Product',
        component: () => import(/* webpackChunkName: "Product" */ '@/views/product'),
        meta: {title: '产品中心',icon: 'codepen'},
      },
      {
        path: '/video-list',
        name: 'VideoList',
        component: () => import(/* webpackChunkName: "VideoList" */ '@/views/video-list'),
        meta: {title: '视频列表',icon: 'video-camera'},
      },
      {
        path: '/download',
        name: 'Download',
        component: () => import(/* webpackChunkName: "Download" */ '@/views/donwload'),
        meta: {title: '资料下载',icon: 'cloud-download'},
      },
      {
        path: '/webMenu',
        name: 'WebMenu',
        component: () => import(/* webpackChunkName: "WebMenu" */ '@/views/web-menu'),
        meta: {title: '网站菜单',icon: 'slack'},
      },
      {
        path: '/userList',
        name: 'UserList',
        component: () => import(/* webpackChunkName: "UserList" */ '@/views/user-list'),
        meta: {title: '系统用户',icon: 'user'},
      },
      {
        path: '/client',
        name: 'Client',
        component: () => import(/* webpackChunkName: "Client" */ '@/views/client'),
        meta: {title: '合作客户',icon: 'aliwangwang'},
      },
      // account
      {
        path: '/system/settings',
        component: () => import('@/views/account/settings/Index'),
        redirect: '/system/settings/basic',
        name: 'settings',
        meta: { title: '网站设置', icon: 'setting', keepAlive: true },
        hideChildrenInMenu: true,
        children: [
          {
            path: '/system/settings/basic',
            name: 'BasicSettings',
            component: () => import('@/views/account/settings/BasicSetting'),
            meta: { title: '基本设置', hidden: true}
          },
          {
            path: '/system/settings/company',
            name: 'Company',
            component: () => import('@/views/account/settings/Company'),
            meta: {
              title: '公司介绍',
              hidden: true,
              keepAlive: true,
            }
          },
          {
            path: '/system/settings/serve',
            name: 'Serve',
            meta: {
              title: '服务保障',
              hidden: true,
              keepAlive: true,
            },
            component: () => import(/* webpackChunkName: "Serve" */ '@/views/account/settings/serve'),
          },
        ]
      }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
