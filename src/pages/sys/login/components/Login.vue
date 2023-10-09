<template>
  <t-form ref="form" :class="['item-container', 'login-password']" :data="formData" label-width="0" @submit="login">
    <template v-if="true">
      <t-form-item
        :rules="[
          { required: true, message: '账号不能为空' },
          { whitespace: true, message: '请输入您的账号' },
        ]"
        name="username"
      >
        <t-input v-model="formData.username" placeholder="请输入账号" size="large">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item
        :rules="[
          { required: true, message: '密码不能为空' },
          { whitespace: true, message: '请输入您的账号' },
          { min: 6, message: '密码最少6位' },
        ]"
        name="password"
      >
        <t-input
          v-model="formData.password"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
          size="large"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-form-item name="remember">
          <t-checkbox v-model="formData.remember">记住我</t-checkbox>
        </t-form-item>
      </div>
    </template>

    <t-form-item class="btn-container">
      <t-button block size="large" type="submit"> 登录</t-button>
    </t-form-item>
  </t-form>
</template>
<script setup>
import { ref } from 'vue';

const showPsw = ref(false);
</script>

<script>
import { useUserStore } from '@/store';
import { request } from '@/utils/request';

const userStore = useUserStore();

export default {
  name: 'PwdLogin',
  data() {
    return {
      formData: {
        username: 'admin',
        password: '123456',
        remember: false,
      },
    };
  },
  methods: {
    login({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return false;
      }
      request
        .post({
          url: '/sys/login/user_passwd',
          data: {
            username: this.formData.username,
            password: this.formData.password,
          },
        })
        .then(({ token }) => {
          userStore.login(token, this.formData.remember);
          this.$router.push(this.$route.query?.redirect ? this.$route.query?.redirect : '/dashboard/base');
          this.$message.success('登陆成功，正在跳转....');
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
