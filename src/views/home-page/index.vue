<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <div>
        <a-button icon="plus" type="primary" @click="hanldeAddClick(1)" style="margin-bottom:20px;">新增第一屏</a-button>
        <a-button icon="plus" type="primary" @click="hanldeAddClick(2)" style="margin-bottom:20px;margin-left:20px;">新增第二屏</a-button>
        <a-button icon="plus" type="primary" @click="hanldeAddClick(5)" style="margin-bottom:20px;margin-left:20px;">新增第三屏</a-button>
        <a-button icon="plus" type="primary" @click="hanldeAddClick(4)" style="margin-bottom:20px;margin-left:20px;">新增第四屏</a-button>
        <a-button icon="plus" type="primary" @click="hanldeAddClick(5)" style="margin-bottom:20px;margin-left:20px;">新增第五屏</a-button>
      </div>
      <a-table 
        size="middle" 
        :columns="columns" 
        :data-source="data" 
        :rowKey="(r) => r.id" 
        :pagination="false"
        :scroll="{x: true}"
      >
        <template slot="pages" slot-scope="r">
          第 {{ r.screen }} 屏
        </template>
        <template slot="type" slot-scope="r">
          <a-tag v-if="r.type == 1" color="green">链接</a-tag>
          <a-tag v-else-if="r.type == 2" color="blue">图片</a-tag>
          <a-tag v-else-if="r.type == 3" color="orange">其他</a-tag>
        </template>
        <template slot="action" slot-scope="t, r, i">
          <a @click="handleEditorClick(r, i)">修改</a>
          <a-divider type="vertical" v-if="r.screen==1 && r.type==2"></a-divider>
          <a-popconfirm
            title="您确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="hanldeDeleteClick(r)"
          >
            <a v-if="r.screen==1 && r.type==2">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!-- 新增 -->
    <CreateModal ref="createModal" :parent="this"></CreateModal>
  </page-header-wrapper>
</template>

<script>
import CreateModal from './modules/CreateModal.vue'
import { getHomePageList,deleteHomPageInfo } from '@/api/manage'
import { getFileName } from '@/utils/util'
import { showMessage } from '@/utils/mixins'

export default {
  name: 'HomePage',
  mixins: [showMessage],
  components: {
    CreateModal,
  },
  data() {
    return {
      columns: [
        { title: '屏数', scopedSlots: {customRender: 'pages'}, align: 'center', width: 120,fixed: 'left'},
        { title: '类型', scopedSlots: { customRender: 'type' } },
        { title: '标题', dataIndex: 'title', key: 'title', width: 300 },
        { title: '描述', dataIndex: 'description', key: 'description'},
        { title: '操作', scopedSlots: { customRender: 'action' },width:100, fixed: 'right', align: 'center' },
      ],
      data: []
    }
  },
  methods: {
    // 删除
    hanldeDeleteClick(r) {
      deleteHomPageInfo({id: r.id}).then(res => {
        this.showMessage(res,this.getList)
      })
    },
    // 新增
    hanldeAddClick(i) {
      if( i == 1 ) {
        this.$refs.createModal.form.screen = 1
      }else {
        this.$refs.createModal.form.screen = 4
      }
      this.$refs.createModal.title = `第1屏新增`
      this.$refs.createModal.visible = true
      this.$refs.createModal.status = 1
    },
    // 修改
    handleEditorClick(r) {
      const _form = this.$refs.createModal.form
      for(const key in _form) {
        _form[key] = r[key]
      }
      this.$refs.createModal.fileList = [
        {name: getFileName(r.image_url),uid: r.id,url: r.image_url}
      ]
      this.$refs.createModal.id = r.id
      this.$refs.createModal.title = `修改第${r.screen}屏`
      this.$refs.createModal.visible = true
      this.$refs.createModal.status = 2
    },
    // 获取首页数据
    getList() {
      getHomePageList({pageSize:50}).then(res => {
        if(res.code == 200) {
          this.data = res.data.list
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>