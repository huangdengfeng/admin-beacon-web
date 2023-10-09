<template>
  <t-dialog
    v-model:visible="visible"
    :close-on-overlay-click="false"
    :destroy-on-close="true"
    :footer="false"
    header="修改"
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
            <t-form-item :rules="[{ required: true }]" help="停用后所有用户都不会有该权限" label="状态" name="status">
              <t-radio-group v-model="data.status" :options="RECORD_STATUS_ARRAY"></t-radio-group>
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
import { RECORD_STATUS_ARRAY } from '@/utils/dict';
import { request } from '@/utils/request';

export default {
  name: 'ModifyForm',
  setup() {
    return { RECORD_STATUS_ARRAY };
  },
  data() {
    return {
      data: {
        id: null,
        parentId: null,
        name: null,
        code: null,
        status: null,
      },
      visible: false,
    };
  },
  methods: {
    open(permission) {
      this.visible = true;
      this.data = { ...permission };
    },
    save({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return;
      }
      this.$loading(true);
      request
        .post({ url: '/sys/permission/modify', data: this.data })
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
