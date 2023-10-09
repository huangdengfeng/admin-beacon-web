import { defineStore } from 'pinia';

import { request } from '@/utils/request';

// 后台参数及字典
export const useParamStore = defineStore('param', {
  state: () => ({
    inited: false,
    // 文件服务器地址
    fileServerUrl: null,
    // 所有字典map
    dictsMap: null,
    // 属性名称
    dictTypeNameMapping: null,
  }),
  actions: {
    async getParam() {
      if (this.inited) {
        return;
      }
      const { fileServerUrl, dicts } = await request.get({
        url: '/sys/param/qry',
      });
      this.fileServerUrl = fileServerUrl;
      const dictsMap = new Map();
      const dictTypeNameMapping = new Map();

      // 循环map ，ts 的原因，如果在js 中可以直接遍历
      for (const [key, value] of new Map(Object.entries(dicts))) {
        const array = [];
        for (const dict of value) {
          array.push({ label: dict.name, value: dict.value, disabled: dict.disabled });
          dictTypeNameMapping.set(`${key}@${dict.value}`, dict.name);
        }
        dictsMap.set(key, array);
      }
      this.dictsMap = dictsMap;
      this.dictTypeNameMapping = dictTypeNameMapping;
      this.inited = true;
    },
  },
});
