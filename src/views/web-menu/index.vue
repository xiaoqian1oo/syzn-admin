<template>
  <page-header-wrapper :title="false">
    <a-card class="content-card">
      <!-- 新增 -->
      <a-row style="margin-bottom:20px;">
        <a-button icon="plus" @click="handleAddClick" type="primary">新增</a-button>
      </a-row>
      <a-table size="middle" :columns="columns" :data-source="data" :rowKey="r => r.id">
        <template slot="type" slot-scope="r">
          <a-tag v-if="r.type == 1" color="green">链接菜单</a-tag>
          <a-tag v-else color="red">系列菜单</a-tag>
        </template>
        <template slot="is_show" slot-scope="r">
          <a-tag v-if="r.is_show == 1" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
        <template slot="action" slot-scope="r">
          <!-- <template v-if="r.id == 2"> -->
          <a @click="handleAddClick(r)">新增</a>
          <a-divider type="vertical"></a-divider>
          <!-- </template> -->
          <a @click="handleEditorClick(r)">修改</a>
          <template v-if="!r.children">
            <a-divider type="vertical"></a-divider>
            <a-popconfirm title="您确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="hanldeDelete(r)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 新增 -->
    <CreateModal ref="createModal" :parent="this"></CreateModal>
  </page-header-wrapper>
</template>

<script>
import { getMenuTree, deleteMenu } from '@/api/manage'
import { showMessage } from '@/utils/mixins'
import CreateModal from './modules/CreateModal.vue'

export default {
  name: 'WebMenu',
  mixins: [showMessage],
  components: {
    CreateModal
  },
  data() {
    return {
      columns: [
        { title: '菜单名称', dataIndex: 'title', key: 'title' },
        { title: '链接地址', dataIndex: 'href', key: 'href', },
        { title: '是否隐藏', scopedSlots: { customRender: 'is_show' }, align: 'center', width: 120  },
        { title: '排序', dataIndex: 'sort', key: 'sort', align: 'center', width: 120  },
        // { title: '类型', scopedSlots: {customRender: 'type'},align:'center'},
        { title: '操作', scopedSlots: { customRender: 'action' }, align: 'left', fixed: 'right', width: 160 },
      ],
      data: []
    }
  },
  methods: {
    // 删除列表
    hanldeDelete(r) {
      deleteMenu({ id: r.id }).then(res => {
        this.showMessage({code:200,message:'删除成功'}, this.getList)
      })
    },
    // 新增
    handleAddClick(r) {
      if (r.id == 5) {
        this.$refs.createModal.form.type = 2
      } else {
        this.$refs.createModal.form.type = 1
      }
      this.$refs.createModal.form.parentId = r.id
      this.$refs.createModal.visible = true
      this.$refs.createModal.status = 1
      this.$refs.createModal.treeData = this.data;
    },
    // 修改
    handleEditorClick(r) {
      console.log('r :>> ', r);
      this.$refs.createModal.status = 2
      this.$refs.createModal.visible = true
      this.$refs.createModal.id = r.id
      this.$refs.createModal.treeData = this.data;
      const _form = this.$refs.createModal.form
      for (const key in _form) {
        if (key == 'parent_id') {
          if( r[key] === 0){
            _form[key] = ''
            this.$refs.createModal.parent_id=''
          }else{
            _form[key] = r[key]
            this.$refs.createModal.parent_id=r[key]
          }
          
        } else {
          _form[key] = r[key]

        }
      }

      // 这是系列带图片的菜单
      //if (r.type == 2) {}
      if(r.img){
        this.$refs.createModal.fileList = [
          {
            name: r.title,
            uid: r.id,
            url: r.img || ''
          }
        ]
      }
    },
    // 获取列表
    getList() {
      getMenuTree().then(res => {
        console.log('res :>> ', res);
        if (res.code == 200) {
          this.data = this.dealMenuList(res.data.list)
        }
      })
    },
    dealMenuList(list) {
      list.forEach(item => {
        if (!item.children || !item.children.length) {
          delete item.children
        } else {
          this.dealMenuList(item.children)
        }
      })
      return list
    }
  },
  mounted() {
    this.getList()
  }
}
</script>