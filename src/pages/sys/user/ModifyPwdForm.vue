<template>
  <t-dialog
    v-model:visible="visible"
    :close-on-overlay-click="false"
    :destroy-on-close="true"
    :footer="false"
    header="修改密码"
    scroll-to-first-error="smooth"
    width="750"
  >
    <template #body>
      <t-form ref="form" :data="data" @submit="save">
        <t-row :gutter="[0, 20]">
          <t-col :span="6">
            <t-form-item label="姓名" name="name">
              <t-input v-model="data.name" disabled></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="用户名" name="userName">
              <t-input v-model="data.userName" disabled></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item
              :rules="[
                { required: true },
                { whitespace: true },
                { min: 6, message: '至少6个字符' },
                {
                  validator: checkPassword,
                },
              ]"
              label="密码"
              name="password"
            >
              <t-input v-model="data.password" :maxcharacter="20" placeholder="请输入密码" type="password"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item
              :rules="[
                { required: true },
                { whitespace: true },
                { min: 6, message: '至少6个字符' },
                {
                  validator: checkPassword,
                },
              ]"
              label="再次输入"
              name="rePassword"
            >
              <t-input
                v-model="data.rePassword"
                :maxcharacter="20"
                placeholder="请再次输入密码"
                type="password"
              ></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item>
              <t-button variant="outline" @click="close()">取消</t-button>
              <t-button theme="primary" type="submit">确定</t-button>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </template>
  </t-dialog>
</template>
<script>
import { request } from '@/utils/request';

export default {
  name: 'ModifyPwdForm',
  data() {
    return {
      data: {},
      visible: false,
    };
  },
  methods: {
    open(uid, name, userName) {
      this.visible = true;
      this.data = { uid, name, userName };
    },
    checkPassword(val) {
      if (!val || !this.data.rePassword || !this.data.password || this.data.rePassword === this.data.password) {
        this.$refs.form.clearValidate(['password', 'rePassword']);
        return { result: true };
      }
      return { result: false, message: '两次密码不一致' };
    },
    save({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return;
      }
      this.$loading(true);
      request
        .post({
          url: '/sys/user/modify_pwd',
          data: {
            uid: this.data.uid,
            password: this.data.password,
          },
        })
        .then(() => {
          this.$emit('refresh');
          this.$message.success('添加成功');
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
