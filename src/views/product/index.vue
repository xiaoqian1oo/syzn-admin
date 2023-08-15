<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="产品标题">
                <a-input v-model="queryParam.title" placeholder="产品标题" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品系列">
                <a-select
                  v-model="queryParam.classify_id"
                  show-search
                  placeholder="选择系列"
                  option-filter-prop="children"
                  allowClear
                  :filter-option="(input,option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                >
                  <a-select-option :value="item.id" v-for="item of menuTree" :key="item.id">{{ item.title }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="getList">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-button type="primary" icon="plus" @click="handleAddClick">添加产品</a-button>
      <a-table 
        style="margin-top: 20px;"
        size="middle"
        :columns="columns" 
        :data-source="data" 
        :rowKey="r=>r.id"
        :loading="loading"
        :pagination="pagination"
      >
        <template slot="image_url" slot-scope="r">
          <img :src="showImg(r.image_url)" alt="" class="table-img" />
        </template>
        <template slot="classify_id" slot-scope="t,r">
          <a-tag color="green" v-if="r.classify_id">{{ r.classify_name }}</a-tag>
          <a-tag v-else>无</a-tag>
        </template>
        <template slot="home_recommend" slot-scope="t,r">
          <a-tag color="blue" v-if="r.home_recommend==1">是</a-tag>
          <a-tag v-else>否</a-tag>
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
    <!-- 新增产品 -->
    <CreateModal ref="createModal" :parent="this"></CreateModal>
  </page-header-wrapper>
</template>

<script>
import { getProductList,getMenuTree,deleteProduct,classifyMenu } from '@/api/manage'
import { showMessage,toggleQuery } from '@/utils/mixins'
import CreateModal from './modules/CreateModal.vue'
import {findNodeItem} from '@/utils/util'

export default {
  name: 'Product',
  mixins: [showMessage,toggleQuery],
  components: {
    CreateModal
  },
  data() {
    return {
      queryParam: {},
      loading: false,
      columns: [
        { title: '序号', customRender: (t,r,i) => `${i+1}`, width: 70, align: 'center' },
        { title: '产品图片', scopedSlots: { customRender: 'image_url' },align:'center',width: 120 },
        { title: '产品名称', dataIndex: 'title',key: 'title'},
        {title: '产品系列',scopedSlots: { customRender: 'classify_id' }, width: 160,},
        {title: '首页显示',scopedSlots: { customRender: 'home_recommend' }, width: 120, align: 'center'},
        { title: '操作', scopedSlots: { customRender: 'action' }, width: 120, fixed: 'right', align: 'center' }
      ],
      data: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条`
        // showSizeChanger: true,
        // pageSizeOptions: ['10', '20', '30', '40']
      },
      pageNum: 1,
      pageSize: 10,
      menuTree: [],
    }
  },
  methods: {
    showImg(str){
      const imgArr=str?str.split(','):[]
      return imgArr[0]
    },
    // 增加
    handleAddClick() {
      this.$refs.createModal.status = 1
      this.$refs.createModal.title = '新增产品'
      this.$refs.createModal.visible = true
    },
    // 分页变化
    paginationChange(e) {
      this.pageNum = e.current
      this.pageSize = e.pageSize
      this.getList()
    },
    // 修改
    handleEditorClick(r) {
      console.log('r :>> ', r);
      const _form = this.$refs.createModal.form
      for(const key in _form) {
        if(key != 'images') {
          if(key == 'classify') {
            _form[key] = Number(r['classify_id'])
          }else {
            _form[key] = r[key]
          }
        }
      }
      const imgArr=r.image_url?r.image_url.split(','):[]
      this.$refs.createModal.form.images=imgArr;
      imgArr.forEach(item=>{
        // Math.random()
        this.$refs.createModal.fileList.push({
            name: Math.random()+r.title,
            uid: Math.random(),
            url: item || ''
          })
      })
      // if(imgArr.length>0){
      //   this.$refs.createModal.fileList.push({
      //       name: r.title,
      //       uid: r.id,
      //       url: r.image_url || ''
      //     })
      // }
      this.$refs.createModal.status = 2
      this.$refs.createModal.id = r.id
      this.$refs.createModal.title = '修改产品'
      this.$refs.createModal.visible = true
    },
    // 删除
    handleDeleteClick(r) {
      deleteProduct({id: r.id}).then(res => {
        this.showMessage(res,this.getList)
      })
    },
    // 列表
    getList() {
      this.loading = true
      const data={
        page:this.pageNum,
        pageSize:this.pageSize,
        title:this.queryParam.title,
        classify_id:this.queryParam.classify_id,
      }
      if(!data.title) delete data.title
      if(!data.classify_id) delete data.classify_id
      getProductList(data).then(res => {
        this.loading = false
        if(res.code == 200) {
          this.data = res.data.list
          this.pagination.total=res.data.total
        }
      })
    },
     //获取系列树结构
   async getMenuTree() {
     const res=await classifyMenu({pageSize:50,id:2})
     if(res.code == 200) {
          this.menuTree=res.data
        }

      // getMenuTree().then(res => {
      //   if(res.code == 200) {
      //     this.menuTree=res.data
      //     const _data = this.dealMenuList(res.data.list.filter(item => item.id == 2))[0].children
      //     for(let i=0; i<_data.length;i++) {
      //       this.menuTree.push(_data[i])
      //     }
      //   }
      // })
    },
    dealMenuList(list) {
      list.forEach(item => {
        if(!item.children || !item.children.length) {
          delete item.children
        }else {
          this.dealMenuList(item.children)
        }
      })
      return list
    }
  },
  mounted() {
    this.getList()
    this.getMenuTree()
  }
}
</script>

<style lang="less">
.table-img {
  width: 60px;
  height: 60px;
}
</style>

