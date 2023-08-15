<template>
  <a-drawer
    :title="title"
    :closable="false"
    :maskClosable="false"
    width="60%"
    :visible="visible"
    :body-style="{ paddingBottom: '80px'}"
    @close="onClose"
  >
    <a-form-model 
      ref="ruleForm"
      :model="form" 
      :rules="rules" 
      :label-col="labelCol" 
      :wrapper-col="wrapperCol" 
      :key="visible"
    >
      <a-form-model-item label="客户名称" prop="name">
        <a-input v-model="form.name" placeholder="客户名称" :maxLength="30" />
      </a-form-model-item>
      <a-form-model-item label="图片" required>
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :remove="hanldeImgRemove"
          @preview="handlePreview"
          :customRequest="handleUploadChange"
          class="upload-half"
          accept="image/*"
        >
          <div class="custom-btn" v-if="fileList.length<1">
            <a-icon type="ant-cloud" style="font-size: 26px" />
            <div class="ant-upload-text">添加图片</div>
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
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="60%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-drawer>
</template>

<script>
import wangEditor from '@/components/Editor/WangEditor.vue'
import { addClient, updateClient} from '@/api/manage'
import { getFileName } from '@/utils/util'
import { showMessage } from '@/utils/mixins'
import { uploadFile, deleteFile } from '@/api/common'

export default {
  props: {
    parent: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [showMessage],
  components: {
    wangEditor
  },
  data() {
    return {
      visible: false,
      title: '',
      labelCol: {span: 3},
      wrapperCol: {span: 21},
      form: {
        name: undefined,
        url: undefined
      },
      rules: {
        title: [{required: true, message: '新闻标题不能为空', trigger: 'blur'}]
      },
      fileList: [],
      status: undefined,
      previewVisible: false,
      previewImage: '',
      id: undefined
    }
  },
  methods: {
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
          _this.form.url = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    //删除图片
    hanldeImgRemove(file) {
      this.fileList = []
      this.form.url=''
      return false;
     deleteFile({filePath: file.url}).then(res => {
        if(res.code == 200) {
          this.showMessage({code:200,message:'删除成功'},() => {
            this.fileList = []
          })
        }
      })
    },
    
    // 提交
    onSubmit () {
      this.$refs.ruleForm.validate(vaild => {
        if(vaild) {
          if(this.status == 1) {
            const data={
              type:2,
              name:this.form.name||'',
              url:this.form.url||'',
              sort:this.form.sort||0,
            }
            addClient(data).then(res => {
              if(res.code==200){

              this.showMessage({code:200,message:'添加成功'}, () => {
                this.onClose()
                this.parent.getList()
              })                
              }
            })
          }else { 
            const data={
              id: this.id,
              type:2,
              name:this.form.name||'',
              url:this.form.url||'',
              sort:this.form.sort||0,
            }
            updateClient(data).then(res => {
              if(res.code==200){
                this.showMessage({code:200,message:'修改成功'}, () => {
                this.onClose()
                this.parent.getList()
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
    }
  }
}
</script>

