<template>
  <div>
    <t-card>
      <t-row :gutter="[0, 20]">
        <t-col :span="12">
          <t-form :data="searchForm" colon @submit="query(true)">
            <t-row :gutter="[0, 20]">
              <t-col :span="3">
                <t-form-item label="用户名" name="username">
                  <t-input v-model="searchForm.username" />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item label="姓名" name="fuzzyName">
                  <t-input v-model="searchForm.fuzzyName" placeholder="支持模糊" />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item label="状态" name="status">
                  <t-select v-model="searchForm.status" :options="SYS_USER_STATUS_ARRAY" clearable></t-select>
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-button style="margin-left: 20px" theme="primary" type="submit">查询</t-button>
                <t-button theme="default" type="reset">重置</t-button>
                <t-button v-auth="['sys:user:add']" theme="default" @click="$refs.addForm.open()"> 添加 </t-button>
              </t-col>
            </t-row>
          </t-form>
        </t-col>
        <t-col :span="12">
          <t-table
            :columns="columns"
            :data="data"
            :loading="tableLoading"
            :pagination="pagination"
            row-key="uid"
            @page-change="pageChange"
            @sort-change="sortChange"
          >
            <template #status="{ row }">
              <t-tag :theme="row.status === RECORD_STATUS_VALID ? 'success' : 'danger'">
                {{ getSysUserStatusName(row.status) }}
              </t-tag>
            </template>
            <template #op="{ row }">
              <t-space>
                <t-link v-auth="['sys:user:modify']" theme="primary" @click="$refs.modifyForm.open(row.uid)"
                  >修改
                </t-link>
                <t-dropdown>
                  <t-icon name="ellipsis" />
                  <t-dropdown-menu>
                    <t-dropdown-item
                      v-if="hasPermission(['sys:user:modify_pwd'])"
                      @click="$refs.modifyPwdForm.open(row.uid, row.name, row.userName)"
                    >
                      修改密码
                    </t-dropdown-item>
                  </t-dropdown-menu>
                </t-dropdown>
              </t-space>
            </template>
          </t-table>
        </t-col>
      </t-row>
    </t-card>
    <add-form ref="addForm" @refresh="query(true)" />
    <modify-form ref="modifyForm" @refresh="query(false)"></modify-form>
    <modify-pwd-form ref="modifyPwdForm"></modify-pwd-form>
  </div>
</template>
<script setup>
import { hasPermission } from '@/directives/auth';
import AddForm from '@/pages/sys/user/AddForm.vue';
import ModifyForm from '@/pages/sys/user/ModifyForm.vue';
import ModifyPwdForm from '@/pages/sys/user/ModifyPwdForm.vue';
import { getSysUserStatusName, RECORD_STATUS_VALID, SORT_ORDER, SYS_USER_STATUS_ARRAY } from '@/utils/dict';

const columns = [
  {
    colKey: 'name',
    title: '姓名',
    ellipsis: true,
  },
  {
    colKey: 'userName',
    title: '用户名',
  },
  {
    colKey: 'mobile',
    title: '手机号',
  },
  {
    colKey: 'status',
    title: '状态',
    width: 80,
  },
  {
    colKey: 'createTime',
    title: '创建时间',
    sorter: true,
    width: 200,
  },
  {
    colKey: 'op',
    title: '操作',
    width: 130,
    fixed: 'right',
  },
];
</script>

<script>
import { request } from '@/utils/request';

export default {
  name: 'SysUser',
  data() {
    return {
      searchForm: {
        username: null,
        fuzzyName: null,
        status: null,
      },
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      tableLoading: false,
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query(resetCurrentPage) {
      if (resetCurrentPage) {
        this.pagination.current = 1;
      }
      this.tableLoading = true;
      request
        .post({
          url: '/sys/user/page',
          data: {
            ...this.searchForm,
            page: this.pagination.current,
            pageSize: this.pagination.pageSize,
            orderBy: this.pagination.orderBy,
          },
        })
        .then(({ total, data }) => {
          this.data = data;
          this.pagination.total = total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    pageChange({ current, pageSize }) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.query();
    },
    sortChange(sort) {
      if (sort) {
        this.pagination.orderBy = `${sort.sortBy} ${sort.descending ? SORT_ORDER.desc : SORT_ORDER.asc}`;
      } else {
        this.pagination.orderBy = null;
      }
      this.query();
    },
  },
};
</script>
