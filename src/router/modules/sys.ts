import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/sys',
    name: 'sys',
    component: Layout,
    redirect: '/sys/permission',
    meta: {title: '系统管理', orderNo: 10, icon: 'system-setting'},
    children: [
      {
        path: 'permission',
        name: 'SysPermission',
        component: () => import('@/pages/sys/permission/index.vue'),
        meta: {title: '权限管理'},
      },
    ],
  },
];
