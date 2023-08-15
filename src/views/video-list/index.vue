<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.title" placeholder="名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="视频所属">
                <a-select
                  allowClear
                  v-model="queryParam.productId"
                  show-search
                  placeholder="视频所属"
                  option-filter-prop="children"
                  style="width: 100%"
                  :filter-option="(input,option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                >
                  <a-select-option :value="item.id" v-for="item of productData" :key="item.id">{{ item.title }}</a-select-option>
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
      <a-button type="primary" icon="plus" @click="handleAddClick">添加视频</a-button>
      <a-table 
        style="margin-top: 20px;"
        size="middle"
        :columns="columns" 
        :data-source="data" 
        :rowKey="r=>r.id"
        :loading="loading"
        :pagination="pagination"
      >
        <template slot="video_image_url" slot-scope="t,r">
          <img :src="r.video_image_url" alt="" class="table-img" />
        </template>
        <template slot="home_recommend" slot-scope="t,r">
          <a-tag color="green" v-if="r.home_recommend==1">是</a-tag>
          <a-tag color="red" v-else>否</a-tag>
        </template>
        <template slot="belong_id" slot-scope="t,r">
          <a-tag color="green" v-if="r.belong_id">{{ findNodeItem(productData,r.belong_id).title }}</a-tag>
          <a-tag v-else>无</a-tag>
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
import { getVideoList,deleteVideoItem,getProductList,classifyMenu } from '@/api/manage'
import { showMessage,toggleQuery } from '@/utils/mixins'
import { getFileName } from '@/utils/util'
import CreateModal from './modules/CreateModal.vue'

export default {
  name: 'VideoList',
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
        { title: '视频标题', dataIndex: 'title',key: 'title', width: 200 },
        
        { title: '视频封面图片', scopedSlots: {customRender: 'video_image_url'}, width: 100},
        { title: '视频地址', dataIndex: 'video_url',key: 'video_url', minWidth: 250 },
        { title: '是否推荐', scopedSlots: {customRender: 'home_recommend'}},
        { title: '所属产品',scopedSlots: {customRender: 'belong_id'}},
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
      productData: [],
    }
  },
  methods: {
    // 增加
    handleAddClick() {
      this.$refs.createModal.status = 1
      this.$refs.createModal.title = '新增视频'
      this.$refs.createModal.visible = true
    },
    // 修改
    handleEditorClick(r) {
      const _form = this.$refs.createModal.form
      for(const key in _form) {
        if(key == 'productId') {
          _form[key] = Number(r[key])
        }else if(key == 'home_recommend') {
          _form[key] = r[key]
        }else {
          _form[key] = r[key]
        }
      }
      if(r.video_image_url) {
        this.$refs.createModal.fileList.push({
          uid: Math.random(),
          url: r.video_image_url,
          name: getFileName(r.video_image_url)
        })
      }
      this.$refs.createModal.status = 2
      this.$refs.createModal.id = r.id
      this.$refs.createModal.title = '修改视频'
      this.$refs.createModal.visible = true
    },
    // 删除
    handleDeleteClick(r) {
      deleteVideoItem({id: r.id}).then(res => {
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
      }
      getVideoList(data).then(res => {
        this.loading = false
        if(res.code == 200) {
          this.data = res.data.list
          this.pagination.total=res.data.total
        }
      })
    },
     //获取系列树结构
   async getProductList() {
    console.log('1111 :>> ', 1111);
      const res=await classifyMenu({pageSize:50,id:2})
      console.log('res :>> ', res);
        if(res.code == 200) {
          this.productData=res.data
        }
      // getProductList().then(res => {
      //   if(res.code == '0') {
      //     this.productData = res.data
      //   }
      // })
    },



    /**
 * 传入参数：需要遍历的json，需要匹配的id(根据id取得对应的那一项)
 * @param data 数组数据，平级或树形数组皆可
 * @param val 键值id的值，（唯一）
 * @param key id 默认（唯一不重复的键值）
 * @param children 子类
 * @returns 
 */
findNodeItem(data, val, key = 'id', children = 'children') {
    let temp = '';
    const forFn = function (arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (temp) break;    // 已经拿到值了,就退出循环
            const item = arr[i];
            // 找到值对应的那一项，赋值
            if (item[key] == val) temp = item;

            if (item[children]) forFn(item[children], id);
        }
    };
    forFn(data, val);
    return temp;
}

  },
  mounted() {
    this.getProductList()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.table-img {
  width: 70px;
  height: 70px;

}
</style>

