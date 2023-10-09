import { defineStore } from 'pinia';

import { removeStorageToken, TOKEN_NAME } from '@/config/global';
import type { UserInfo } from '@/types/interface';
import { request } from '@/utils/request';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  photo: '',
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    inited: false,
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    login(token: string, rememberMe: boolean) {
      removeStorageToken();
      if (rememberMe) {
        localStorage.setItem(TOKEN_NAME, token);
      } else {
        sessionStorage.setItem(TOKEN_NAME, token);
      }
    },
    async getUserInfo() {
      if (this.inited) {
        return;
      }
      const { name, photo, roles, permissions } = await request.get({
        url: '/sys/user/my',
      });
      this.userInfo.name = name;
      this.userInfo.photo = photo;
      if (roles) {
        this.userInfo.roles = roles.concat(permissions);
      }
      this.inited = true;
    },
    async logout() {
      removeStorageToken();
      this.userInfo = { ...InitUserInfo };
    },
  },
});
