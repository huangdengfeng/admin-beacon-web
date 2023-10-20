<template>
  <t-dialog
    v-model:visible="visible"
    :close-on-overlay-click="false"
    :destroy-on-close="true"
    :footer="false"
    header="修改用户信息"
    scroll-to-first-error="smooth"
    width="750"
  >
    <template #body>
      <t-form ref="form" :data="data" @submit="save">
        <t-row :gutter="[0, 20]">
          <t-col :span="6">
            <t-form-item :rules="[{ required: true }, { whitespace: true }]" label="姓名" name="name">
              <t-input v-model="data.name" :maxcharacter="20" placeholder="请输入姓名"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6"></t-col>
          <t-col :span="6">
            <t-form-item
              :rules="[
                { required: true },
                { whitespace: true },
                { min: 5, message: '至少5个字符' },
                {
                  validator: checkUserName,
                  trigger: 'blur',
                },
              ]"
              label="用户名"
              name="userName"
            >
              <t-input v-model="data.userName" :maxcharacter="20" placeholder="用于登录，不能重复"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item :rules="[{ whitespace: true }]" label="手机号" name="mobile">
              <t-input v-model="data.mobile" :maxcharacter="20" placeholder=""></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item
              :rules="[{ whitespace: true }, { email: true, message: '请输入正确邮箱地址' }]"
              label="邮箱"
              name="email"
            >
              <t-input v-model="data.email" :maxcharacter="50" placeholder=""></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item :rules="[{ required: true }]" label="状态" name="status">
              <t-radio-group v-model="data.status" :options="SYS_USER_STATUS_ARRAY"></t-radio-group>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item :rules="[]" label="角色" name="roleIds">
              <t-checkbox-group v-model="data.roleIds" :options="roles"></t-checkbox-group>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item :rules="[]" label="备注" name="remark">
              <t-textarea v-model="data.remark" :maxcharacter="100" placeholder="请输入备注"></t-textarea>
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
import { SYS_USER_STATUS_ARRAY } from '@/utils/dict';
import { request } from '@/utils/request';

export default {
  name: 'ModifyForm',
  setup() {
    return { SYS_USER_STATUS_ARRAY };
  },
  data() {
    return {
      data: {},
      visible: false,
      roles: [],
    };
  },
  mounted() {
    request.post({ url: '/sys/role/list', data: { onlyValid: true } }).then((data) => {
      this.roles = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    });
  },
  methods: {
    open(uid) {
      this.visible = true;
      request.get({ url: `/sys/user/detail/${uid}` }).then((data) => {
        this.data = data;
      });
    },
    checkUserName(userName) {
      return new Promise((resolve) => {
        if (!userName) {
          resolve(true);
        } else {
          request.post({ url: '/sys/user/page', data: { userName } }).then(({ total, data }) => {
            if (total === 1 && this.data.uid !== data[0].uid) {
              resolve({ result: false, message: '用户名已存在' });
            } else {
              resolve(true);
            }
          });
        }
      });
    },
    save({ validateResult, e }) {
      e.preventDefault();
      if (validateResult !== true) {
        return;
      }
      this.$loading(true);
      request
        .post({
          url: '/sys/user/modify',
          data: {
            uid: this.data.uid,
            name: this.data.name,
            userName: this.data.userName,
            mobile: this.data.mobile,
            email: this.data.email,
            status: this.data.status,
            remarks: this.data.remarks,
            roleIds: this.data.roleIds,
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
