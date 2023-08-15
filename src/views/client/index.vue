<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="客户名称">
                <a-input v-model="queryParam.name" placeholder="客户名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="getSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新增 -->
      <a-row style="margin-bottom:20px;">
        <a-button icon="plus" @click="handleAddClick" type="primary">新增客户</a-button>
      </a-row>
      <a-table 
        size="middle"
        :columns="columns" 
        :data-source="data" 
        :rowKey="r=>r.id"
        :pagination="pagination"
      >
        <template slot="url" slot-scope="r">
          <img :src="r.url" alt="" class="table-img" />
        </template>
        <template slot="action" slot-scope="r">
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
import CreateModal from './modules/CreateModal.vue'
import { toggleQuery,showMessage } from '@/utils/mixins'
import { getClientList,deleteClient } from '@/api/manage'

export default {
  name: 'News',
  mixins: [toggleQuery,showMessage],
  components: {
    CreateModal
  },
  data () {
    return {
      queryParam: {},
      columns: [
        {title: '序号',customRender: (t,r,i) => `${i+1}`,width: 70,align: 'center'},
        {title: '客户名称',dataIndex: 'name',key: 'name',ellipsis: true},
        {title: 'logo',scopedSlots: {customRender: 'url'},align:'center'},
        {title: '操作',scopedSlots: {customRender: 'action'},width: 120,align: 'center'}
      ],
      data: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条`
        // defaultPageSize: 10,
        // showSizeChanger: true,
        // pageSizeOptions: ['10', '20', '30', '40']
      },
      pageNum: 1,
      pageSize: 10,
    }
  },
  methods: {
    // 新增
    handleAddClick() {
      this.$refs.CreateModal.status = 1
      this.$refs.CreateModal.visible = true
      this.$refs.CreateModal.title = '新增新闻'
    },
    // 分页查询
    paginationChange(e) {
      this.pageNum = e.current
      this.pageSize = e.pageSize
      this.getList()
    },
    // 查询
    getSearch() {
      this.pageNum = 1
      this.getList()
    },
    // 修改
    handleEditorClick(r) {
      this.$refs.CreateModal.id = r.id
      this.$refs.CreateModal.status = 2
      this.$refs.CreateModal.visible = true
      this.$refs.CreateModal.title = '修改新闻'
      for(const key in this.$refs.CreateModal.form) {
        this.$refs.CreateModal.form[key] = r[key]
      }
      this.$refs.CreateModal.fileList = [
        {
          uid: Math.random(),
          name: '111',
          url: r.url
        }
      ]
    },
    // 删除
    handleDeleteClick(r) {
      deleteClient({id: r.id}).then(res => {
        if(res.code==200){

          this.showMessage({code:200,message:'删除成功'},this.getList)
        }
      })
    },
    // 获取列表
    getList() {
      const data={
        page:this.pageNum,
        pageSize:this.pageSize,
        name:this.queryParam.name,
        type:2,
      }
      if(!data.name) delete data.name

      getClientList(data).then(res => {
        if(res.code == 200) {
          this.data = res.data.list
          this.pagination.total=res.data.total
        }
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less">
.table-img {
  height: 40px;
}
</style>