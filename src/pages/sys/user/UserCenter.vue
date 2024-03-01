<template>
  <div>
    <t-card title="个人信息">
      <template #actions>
        <t-link theme="primary" @click="visible = true">修改密码</t-link>
      </template>
      <t-row :gutter="[0, 20]">
        <t-col :span="2">
          <div>
            <span>姓名：{{ info.name }}</span>
          </div>
        </t-col>
        <t-col :span="2">
          <div>
            <span>账号：{{ info.userName }}</span>
          </div>
        </t-col>
        <t-col :span="2">
          <div>
            <span>手机号：{{ info.mobile }}</span>
          </div>
        </t-col>
        <t-col :span="2">
          <div>
            <span>邮箱：{{ info.email }}</span>
          </div>
        </t-col>
      </t-row>
      <t-space></t-space>
      <t-row :gutter="[0, 20]">
        <t-col :span="12">
          <div>
            <span>角色：{{ info.roleNames?.join('，') }}</span>
          </div>
        </t-col>
      </t-row>
    </t-card>
    <t-dialog
      v-model:visible="visible"
      :close-on-overlay-click="false"
      :destroy-on-close="true"
      :footer="false"
      header="修改密码"
      width="550"
    >
      <template #body>
        <t-form ref="form" :data="pwdData" @submit="save">
          <t-row :gutter="[0, 20]">
            <t-col :span="12">
              <t-form-item
                :rules="[{ required: true }, { whitespace: true }, { min: 6, message: '至少6个字符' }]"
                label="原密码"
                name="oldPassword"
              >
                <t-input
                  v-model="pwdData.oldPassword"
                  :maxcharacter="20"
                  placeholder="请输入原密码"
                  type="password"
                ></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item
                :rules="[
                  { required: true },
                  { whitespace: true },
                  { min: 6, message: '至少6个字符' },
                  {
                    validator: checkPassword,
                  },
                ]"
                label="新密码"
                name="newPassword"
              >
                <t-input
                  v-model="pwdData.newPassword"
                  :maxcharacter="20"
                  placeholder="请输入新密码"
                  type="password"
                ></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="12">
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
                  v-model="pwdData.rePassword"
                  :maxcharacter="20"
                  placeholder="请再次输入密码"
                  type="password"
                ></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item help="修改密码成功后将重新登录">
                <t-button variant="outline" @click="close()">取消</t-button>
                <t-button theme="primary" type="submit">确定</t-button>
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
      </template>
    </t-dialog>
  </div>
</template>
<script>
import router from '@/router';
import { useUserStore } from '@/store';
import { request } from '@/utils/request';

const userStore = useUserStore();

export default {
  name: 'UserCenter',
  data() {
    return {
      info: {},
      pwdData: {},
      visible: false,
    };
  },
  mounted() {
    request.get({ url: '/sys/user/my' }).then((data) => {
      this.info = data;
    });
  },
  methods: {
    checkPassword(val) {
      if (
        !val ||
        !this.pwdData.rePassword ||
        !this.pwdData.newPassword ||
        this.pwdData.rePassword === this.pwdData.newPassword
      ) {
        this.$refs.form.clearValidate(['newPassword', 'rePassword']);
        return { result: true };
      }
      return { result: false, message: '两次密码不一致' };
    },
    close() {
      this.visible = false;
    },
    save({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return;
      }
      this.$loading(true);
      request
        .post({
          url: '/sys/user/modify_my_pwd',
          data: {
            oldPassword: this.pwdData.oldPassword,
            newPassword: this.pwdData.newPassword,
          },
        })
        .then(() => {
          // this.$message.success('修改成功');
          this.close();
          userStore.logout();
          router.push('/login');
        })
        .finally(() => {
          this.$loading(false);
        });
    },
  },
};
</script>
