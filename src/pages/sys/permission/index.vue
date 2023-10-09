<template>
  <div>
    <t-card :bordered="false">
      <t-row>
        <t-col>
          <t-button theme="primary" @click="$refs.addForm.open()">添加</t-button>
          <t-button theme="default" @click="expandAll()">展开</t-button>
          <t-button theme="default" @click="foldAll()">收起</t-button>
        </t-col>
      </t-row>
      <t-enhanced-table ref="treeTable" :columns="columns" :data="data" :tree="{ defaultExpandAll: true }" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === RECORD_STATUS_INVALID ? 'danger' : 'success'">
            {{ getRecordStatusName(row.status) }}
          </t-tag>
        </template>
        <template #op="{ row }">
          <t-space>
            <t-link theme="primary" @click="$refs.addForm.open(row.id)">添加子节点</t-link>
            <t-link theme="primary" @click="$refs.modifyForm.open(row)">修改</t-link>
            <t-link theme="danger" @click="remove(row.id, row.name)">删除</t-link>
          </t-space>
        </template>
      </t-enhanced-table>
    </t-card>
    <add-form ref="addForm" @refresh="query()" />
    <modify-form ref="modifyForm" @refresh="query()" />
  </div>
</template>
<script setup>
import { reactive } from 'vue';

import AddForm from '@/pages/sys/permission/AddForm.vue';
import ModifyForm from '@/pages/sys/permission/ModifyForm.vue';
import { getRecordStatusName, RECORD_STATUS_INVALID } from '@/utils/dict';

const columns = reactive([
  { colKey: 'name', title: '名称' },
  { colKey: 'code', title: '编码' },
  { colKey: 'status', title: '状态' },
  { colKey: 'op', title: '操作', width: 200 },
]);
</script>
<script>
import { request } from '@/utils/request';

export default {
  name: 'SysPermission',
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    expandAll() {
      this.$refs.treeTable.expandAll();
    },
    foldAll() {
      this.$refs.treeTable.foldAll();
    },
    remove(id, name) {
      const confirmDialog = this.$dialog.confirm({
        header: `请确认删除权限【${name}】`,
        body: '将同步删除其子节点，请谨慎操作',
        theme: 'warning',
        onConfirm: () => {
          request
            .post({
              url: '/sys/permission/delete',
              data: { id },
            })
            .then(() => {
              // 请求成功后，销毁弹框
              confirmDialog.destroy();
              this.$message.success('删除成功');
              this.query();
            });
        },
      });
    },
    query() {
      request
        .post({
          url: '/sys/permission/qry',
        })
        .then((list) => {
          const data = [];
          for (const permission of list) {
            data.push({
              id: permission.id,
              name: permission.name,
              code: permission.code,
              status: permission.status,
              children: permission.children,
            });
          }
          this.data = data;
        });
    },
  },
};
</script>
