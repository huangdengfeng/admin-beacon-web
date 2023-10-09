<template>
  <t-dialog
    v-model:visible="visible"
    :close-on-overlay-click="false"
    :destroy-on-close="true"
    :footer="false"
    header="添加"
    scroll-to-first-error="smooth"
    width="750"
  >
    <template #body>
      <t-form ref="form" :data="data" style="min-height: 150px" @submit="save">
        <t-row :gutter="[0, 20]">
          <t-col :span="6">
            <t-form-item :rules="[{ required: true }, { whitespace: true }]" label="名称" name="name">
              <t-input v-model="data.name" :maxcharacter="20" placeholder="请输入内容"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item :rules="[{ required: true }, { whitespace: true }]" label="编码" name="code">
              <t-input v-model="data.code" :maxcharacter="20" placeholder="请输入内容"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item>
              <t-button variant="outline" @click="close()">取消</t-button>
              <t-button theme="primary" type="submit">保存</t-button>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </template>
  </t-dialog>
</template>
<script>
import { request } from '@/utils/request';

const INIT_DATA = {
  parentId: null,
  name: null,
  code: null,
};
export default {
  name: 'AddForm',
  data() {
    return {
      data: { ...INIT_DATA },
      visible: false,
    };
  },
  methods: {
    open(parentId) {
      this.visible = true;
      this.data = { ...INIT_DATA };
      this.data.parentId = parentId;
    },
    save({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return;
      }
      this.$loading(true);
      request
        .post({ url: '/sys/permission/add', data: this.data })
        .then(() => {
          this.$emit('refresh');
          this.$message.success('保存成功');
          this.close();
        })
        .finally(() => {
          this.$loading(false);
        });
    },
    close() {
      this.visible = false;
    },
  },
};
</script>
