<template>
  <div>
    <t-card>
      <t-row>
        <t-col>
          <t-button v-auth="['sys:role:add']" theme="primary" @click="$refs.addForm.open()">添加 </t-button>
        </t-col>
      </t-row>
      <t-table :columns="columns" :data="data" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === RECORD_STATUS_VALID ? 'success' : 'danger'">
            {{ getRecordStatusName(row.status) }}
          </t-tag>
        </template>
        <template #op="{ row }">
          <t-space>
            <t-link v-auth="['sys:permission:modify']" theme="primary" @click="$refs.modifyForm.open(row.id)"
              >修改
            </t-link>
            <t-popconfirm content="确认删除吗？" @confirm="remove(row.id)">
              <t-link v-auth="['sys:permission:delete']" theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>
    <add-form ref="addForm" @refresh="query()" />
    <modify-form ref="modifyForm" @refresh="query()" />
  </div>
</template>
<script setup>
import AddForm from '@/pages/sys/role/AddForm.vue';
import ModifyForm from '@/pages/sys/role/ModifyForm.vue';
import { getRecordStatusName, RECORD_STATUS_VALID } from '@/utils/dict';

const columns = [
  { colKey: 'name', title: '名称' },
  { colKey: 'code', title: '编码' },
  { colKey: 'status', title: '状态' },
  { colKey: 'op', title: '操作', width: 120 },
];
</script>
<script>
import { request } from '@/utils/request';

export default {
  name: 'SysRole',
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      request
        .post({
          url: '/sys/role/list',
        })
        .then((data) => {
          this.data = data;
        });
    },
    remove(id) {
      this.$loading(true);
      request
        .post({ url: '/sys/role/delete', data: { id } })
        .then(() => {
          this.query();
          this.$message.success('删除成功');
        })
        .finally(() => {
          this.$loading(false);
        });
    },
  },
};
</script>
