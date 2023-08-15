<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder="用户名" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="登录账号">
                <a-input v-model="queryParam.account" placeholder="登录账号" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="getList">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新增 -->
      <a-row style="margin-bottom:20px;">
        <a-button icon="plus" @click="handleAddClick" type="primary">添加用户</a-button>
      </a-row>
      <a-table 
        size="middle"
        :columns="columns" 
        :data-source="data" 
        :rowKey="r=>r.id"
        :pagination="pagination"
        :loading="loading"
      >
        <template slot="status" slot-scope="r">
          <a-switch checked-children="正常" un-checked-children="冻结" :checked="r.status" @click="handleStatusChange(r)" />
        </template>
        <template slot="action" slot-scope="r">
          <a-popconfirm
            title="您确定要重置密码吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleResetClick(r)"
          >
            <a>重置密码</a>
          </a-popconfirm>
          <a-divider type="vertical"></a-divider>
          <a @click="handleEditorClick(r)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm
            title="您确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDeleteClick(r)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!-- 新增 -->
    <CreateModal ref="CreateModal" :parent="this"></CreateModal>
  </page-header-wrapper>
</template>

<script>
import { getUserList,updateUser,deleteUser,resetUserPassword } from '@/api/manage'
import { showMessage } from '@/utils/mixins'
import CreateModal from './modules/CreateModal.vue'

export default {
  name: 'UserList',
  mixins: [showMessage],
  components: { 
    CreateModal
  }, 
  data() {
    return {
      queryParam: {},
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条`
      },
      data: [],
      columns: [
        {title: '序号',customRender:(t,r,i) =>`${i+1}`, align:'center',width:70 },
        {title: '登录账号',dataIndex: 'account',key: 'account',width: 300 },
        {title: '用户昵称',dataIndex: 'username',key: 'username',width: 300 },
        {title: '账户状态',scopedSlots: {customRender: 'status'}},
        {title: '操作',scopedSlots: {customRender: 'action'},width: 180,fixed: 'right'}
      ]
    }
  },
  methods: {
    // 重置密码
    handleResetClick(r) {
      resetUserPassword({id: r.id}).then(res => {
        if(res.code == 200) {
          this.$notification.success({
            message: '重置密码成功',
            duration: null,
            description:
              `新密码为：${res.data}`
          });
        }else {
          this.$message.warning(res.message)
        }
      })
    },
    handleAddClick() {
      this.$refs.CreateModal.status = 1
      this.$refs.CreateModal.visible = true
      this.$refs.CreateModal.title = '新增用户'
    },
    // 删除
    handleDeleteClick(r) {
      deleteUser({id: r.id}).then(res => {
        if(res.code == 200) {
          this.showMessage({code:200,message:'删除成功'},this.getList)
        }
      })
    },
    // 修改
    handleEditorClick(r) {
      const _form = this.$refs.CreateModal.form
      this.$refs.CreateModal.id = r.id
      this.$refs.CreateModal.status = 2
      this.$refs.CreateModal.visible = true
      this.$refs.CreateModal.title = '修改用户信息'
      for(const key in _form) {
        if(key == 'status') {
          _form[key] = r.status ? 1 : 2
        }else {
          _form[key] = r[key]
        }
      }
    },
    // 分页查询
    paginationChange(e) {
      this.pageNum = e.current
      this.pageSize = e.pageSize
      this.getList()
    },
    // 用户列表
    getList() {
      this.loading = true
      const data={
        page:this.pageNum,
        pageSize:this.pageSize,
        username:this.queryParam.username,
        account:this.queryParam.account,
      }
      if(!data.username) delete data.username
      if(!data.account) delete data.account

      getUserList(data).then(res => {
        this.loading = false
        if(res.code == 200) {
          const _data = res.data.list
          _data.forEach(item => {
            item.status = item.status == 1 ? true : false
          })
          this.data = _data
          this.pagination.total=res.data.total
        }
      })
    },
    // 改变状态
    handleStatusChange(r) {
      updateUser({id: r.id,status: r.status?1:2,username: r.username}).then(res => {
        if(res.code==200) this.showMessage({code:200,message:'设置成功'}, this.getList)
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>