<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="新闻标题">
                <a-input v-model="queryParam.title" placeholder="新闻标题" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="新闻类型">
                <a-select v-model="queryParam.type" placeholder="新闻类型" allowClear>
                  <a-select-option value="1">公司新闻</a-select-option>
                  <!-- <a-select-option value="2">行内资讯</a-select-option> -->
                  <a-select-option value="3">使用案例</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="getSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新增 -->
      <a-row style="margin-bottom:20px;">
        <a-button icon="plus" @click="handleAddClick" type="primary">新增</a-button>
      </a-row>
      <a-table 
        size="middle"
        :columns="columns" 
        :data-source="data" 
        :rowKey="r=>r.id"
        :pagination="pagination"
        :loading="loading"
      >
        <template slot="type" slot-scope="t">
          <a-tag v-if="t==1" color="green">公司新闻</a-tag>
          <a-tag v-else-if="t==2" color="red">行内资讯</a-tag>
          <a-tag v-else color="red">使用案例</a-tag>
        </template>
        <!-- <template slot="status" slot-scope="t">
          <a-switch checked-children="正常" un-checked-children="冻结" :checked="t" />
        </template> -->
        <template slot="homeRecommend" slot-scope="t">
          <a-tag v-if="!t">否</a-tag>
          <a-tag v-else color="green">是</a-tag>
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
import { getNewsList,deleteNews } from '@/api/manage'
import { getFileName } from '@/utils/util'

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
        {title: '标题',dataIndex: 'title',key: 'title',ellipsis: true,width:'50%'},
        {title: '类别',dataIndex: 'type',key: 'type',scopedSlots: {customRender: 'type'},align:'center'},
        // {title: '状态',dataIndex: 'status',key: 'status',scopedSlots: {customRender: 'status'},align:'center'},
        {title: '是否推荐',dataIndex: 'homeRecommend',key: 'homeRecommend',scopedSlots: {customRender: 'homeRecommend'},align:'center'},
        {title: '操作',scopedSlots: {customRender: 'action'},width: 120,align: 'center',fixed: 'right'}
      ],
      data: [],
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条`
        // showSizeChanger: true,
        // pageSizeOptions: ['10', '20', '30', '40']
      },
      pageNum: 1,
      pageSize: 10
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
      console.log('r :>> ', r);
      const _form = this.$refs.CreateModal.form
      this.$refs.CreateModal.id = r.id
      this.$refs.CreateModal.status = 2
      this.$refs.CreateModal.visible = true
      this.$refs.CreateModal.title = '修改新闻'
      console.log(_form)
      for(const key in _form) {
        _form[key] = r[key]
      }
      if(r.img) {
        this.$refs.CreateModal.fileList.push({
          uid: r.id,
          name: getFileName(r.img),
          url: r.img
        })
      }
    },
    // 删除
    handleDeleteClick(r) {
      deleteNews({id: r.id}).then(res => {
        console.log('res :>> ', res);
        if(res.code == 200) {
          this.showMessage(res,this.getList)
        }
      })
    },
    // 获取列表
    getList() {
      this.loading = true
      console.log('this.queryParam :>> ', this.queryParam);
      const data={
        page:this.pageNum,
        pageSize:this.pageSize,
        title:this.queryParam.title,
        type:this.queryParam.type,
      }
      if(!data.title) delete data.title
      if(!data.type) delete data.type
      getNewsList(data).then(res => {
        console.log('res :>> ', res);
        this.loading = false
        if(res.code == 200) {
          this.data = res.data.list
          this.pagination.total=res.data.total
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>