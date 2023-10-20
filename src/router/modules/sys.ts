import { LogoutIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/sys',
    name: 'sys',
    component: Layout,
    redirect: '/sys/user',
    meta: { title: '系统管理', orderNo: 10, icon: 'system-setting' },
    children: [
      {
        path: 'user',
        name: 'SysUser',
        component: () => import('@/pages/sys/user/index.vue'),
        meta: { title: '用户管理', roleCode: 'sys:user' },
      },
      {
        path: 'role',
        name: 'SysRole',
        component: () => import('@/pages/sys/role/index.vue'),
        meta: { title: '角色管理', roleCode: 'sys:role' },
      },
      {
        path: 'permission',
        name: 'SysPermission',
        component: () => import('@/pages/sys/permission/index.vue'),
        meta: { title: '权限管理', roleCode: 'sys:permission' },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: '登录', icon: shallowRef(LogoutIcon), hidden: true },
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'index',
        redirect: '/login',
        component: () => import('@/layouts/blank.vue'),
        meta: { title: '登录中心' },
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '个人中心', icon: 'user-circle', hidden: true },
    children: [
      {
        path: 'index',
        name: 'UserCenter',
        component: () => import('@/pages/sys/user/UserCenter.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
];
