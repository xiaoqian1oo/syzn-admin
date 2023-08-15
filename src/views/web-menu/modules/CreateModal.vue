<template>
  <a-drawer
    :closable="false"
    :maskClosable="false"
    title="修改菜单"
    width="40%"
    :visible="visible"
    :body-style="{ paddingBottom: '80px'}"
    @close="onClose"
  >
    <a-tabs v-model="tabkey">
      <a-tab-pane key="1" tab="中文"></a-tab-pane>
      <a-tab-pane key="2" tab="英文" :forceRender="true"></a-tab-pane>
    </a-tabs>
    <a-form-model 
      ref="ruleForm"
      :model="form" 
      :rules="rules"
      :label-col="labelCol" 
      :wrapper-col="wrapperCol" 
      :key="visible"
    >
      <a-form-model-item label="上级菜单" prop="parent_id">
        <a-tree-select
          v-model="form.parent_id"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          treeCheckStrictly
          :tree-data="treeData"
          :replaceFields="{children:'children', title:'title', key:'id', value: 'id' }"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select>

      </a-form-model-item>
      <a-form-model-item label="菜单名称" prop="title" v-if="tabkey=='1'">
        <a-input v-model="form.title" :maxLength="20"/>
      </a-form-model-item>
      <a-form-model-item label="英文菜单名称" prop="title_en" v-else>
        <a-input v-model="form.title_en" :maxLength="20"/>
      </a-form-model-item>
      <a-form-model-item label="链接地址" prop="href" :disabled="tabkey=='2'">
        <a-input v-model="form.href" :maxLength="100"/>
      </a-form-model-item>
      <a-form-model-item label="排序">
        <a-input-number style="width:100px" v-model="form.sort" :maxlength="10"/>
      </a-form-model-item>
      <a-form-model-item label="是否隐藏">
        <a-radio-group v-model="form.is_show">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="2">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- v-if="form.type==2" -->
      <a-form-model-item label="图片">
        <a-upload
          :customRequest="handleUploadChange"
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          :remove="hanldeImgRemove"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
      </a-form-model-item>
    </a-form-model>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 99999,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose"> 关闭 </a-button>
      <a-button type="primary" @click="onSubmit"> 提交 </a-button>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false" width="60%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-drawer>
</template>

<script>
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'
import { showMessage } from '@/utils/mixins'
import { updateMenuTree,addMenu } from '@/api/manage'

export default {
  mixins: [showMessage],
  props: {
    parent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tabkey: '1',
      visible: false,
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      form: {
        parent_id: undefined,
        title: undefined,
        title_en: undefined,
        type: undefined,
        href: '',
        sort: '',
        is_show: 2,
      },
      rules: {
        title: [{required: true,message: '菜单名称不能为空',trigger: 'blur'}],
        title_en: [{required: true,message: '英文菜单名称不能为空',trigger: 'blur'}],
        href: [{required: true,message: '英文菜单名称不能为空',trigger: 'blur'}],
      },
      status: undefined,
      fileList: [],
      previewVisible: false,
      previewImage: undefined,
      id: undefined,
      treeData:[],  // 上级菜单
      parent_id:0,  // 默认上级id
    }
  },
  computed:{
      // 计算属性的 getter
      unParentId: function () {
      // `this` 指向 vm 实例
      return this.lookForAllId(this.treeData,this.id)
      }
  },
  methods: {
// 获取当前id下的所有id
lookForAllId(data = [],id, arr = []) {
    for (const item of data) {
       if(item.id==id || id==='_'){
        arr.push(item.id)
        if (item.children && item.children.length) this.lookForAllId(item.children,'_', arr)
       }else{
        if (item.children && item.children.length) this.lookForAllId(item.children,item.id, arr)
       }
        
    }
    return arr
},

    // 删除图片
    hanldeImgRemove(file) {
      this.fileList = []
      this.form.img='';
      return
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == 200) {
          this.showMessage(res,() => {
            this.fileList = []
          })
        }
      })
    },
    //自定义上传图片
    handleUploadChange(file) {
      file = file.file
      const _this = this
      const formdata = new FormData()
      formdata.append('file', file)
      uploadFile(formdata).then(res => {
        if(res.code == 200) {
          file.url = res.data.file
          file.uid = Math.random()
          file.fileame = getFileName( res.data.file )
          _this.fileList.push(file)
          _this.form.img = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    // 预览
    async handlePreview(file) {
      if (!file.url && !file.preview ) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 提交
    onSubmit () {

      this.$refs.ruleForm.validate(vaild => {
        if(vaild) {
          // this.form.href = this.form.type == 2 ? '/products': '/product_list'
          if(this.status==1) {
            const data={
              parent_id: this.form.parent_id||0,   //  
                title: this.form.title||'',   // 标题 
                title_en: this.form.title_en||'',   //  
                href: this.form.href||'',   // 链接 
                img:this.form.img||'',
                sort: this.form.sort||0,   //  排序
                is_show: this.form.is_show|| 2,    // 是否显示
            }

            addMenu(data).then(res => {
              if(res.code == 200) {
                this.showMessage({code:200,message:'添加成功'},() => {
                  this.parent.getList()
                  this.onClose()
                })
              }
            })
          }else {
            let parent_id=this.form.parent_id;
            if(this.unParentId.includes(parent_id)){
              parent_id=this.parent_id;
            }
            const data={
              id: this.id,
              parent_id: parent_id||0,   //  
                title: this.form.title||'',   // 标题 
                title_en: this.form.title_en||'',   //  
                href: this.form.href||'',   // 链接 
                img:this.form.img||'',
                sort: this.form.sort||0,   //  排序
                is_show: this.form.is_show|| 2,    // 是否显示
            }

            updateMenuTree(data).then(res => {
              if(res.code == 200) {
              this.showMessage({code:200,message:'修改成功'},() => {
                this.parent.getList()
                this.onClose()
              })
            }
            })
          }
        }else {
          return false
        }
      })
    },
    // 关闭
    onClose() {
      this.status = undefined
      this.visible = false
      this.id = undefined
      this.fileList = []
      for(const key in this.form) {
        this.form[key] = undefined
      }

      this.tabkey = '1'
    }
  }
}
</script>