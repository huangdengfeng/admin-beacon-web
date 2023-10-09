<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">Admin Beacon</h1>
      </div>
      <login />
    </div>

    <footer class="copyright">Copyright @ 2023-2026 Seezoon. All Rights Reserved</footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
