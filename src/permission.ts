import 'nprogress/nprogress.css'; // progress bar style

import NProgress from 'nprogress'; // progress bar
import { MessagePlugin } from 'tdesign-vue-next';

import { getStorageToken } from '@/config/global';
import router from '@/router';
import { getPermissionStore, useParamStore, useUserStore } from '@/store';

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const permissionStore = getPermissionStore();
  const paramStore = useParamStore();

  const { whiteListRouters } = permissionStore;

  const userStore = useUserStore();
  const token = getStorageToken();

  if (token) {
    if (to.path === '/login') {
      next();
      return;
    }
    try {
      await userStore.getUserInfo();
      await paramStore.getParam();

      if (permissionStore.routers.length === 0) {
        permissionStore.initRoutes(userStore.roles);
      }

      if (router.hasRoute(to.name)) {
        next();
      } else {
        next(`/`);
      }
    } catch (error) {
      MessagePlugin.error(error.message);
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
      NProgress.done();
    }
  } else {
    /* white list router */
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
    }
    NProgress.done();
  }
});

router.afterEach((to) => {
  if (to.path === '/login') {
    const userStore = useUserStore();
    const permissionStore = getPermissionStore();

    userStore.logout();
    permissionStore.restore();
  }
  NProgress.done();
});
