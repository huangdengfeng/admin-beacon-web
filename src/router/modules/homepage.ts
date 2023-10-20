import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'index',
        name: 'DashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: {
          title: '首页',
          hidden: true,
        },
      },
    ],
  },
];
