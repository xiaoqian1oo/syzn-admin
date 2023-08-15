<template>
  <a-drawer
    :title="title"
    width="40%"
    :closable="false"
    :maskClosable="false"
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
      <a-form-model-item label="屏序号" prop="screen">
        <a-input v-model="form.screen" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="标题" prop="title" v-if="tabkey==1">
        <a-input v-model="form.title" placeholder="标题" :maxLength="80" />
      </a-form-model-item>
      <a-form-model-item label="英文标题" prop="title_en" v-else>
        <a-input v-model="form.title_en" placeholder="英文标题" :maxLength="80" />
      </a-form-model-item>
      <a-form-model-item label="描述" prop="description" v-if="tabkey==1">
        <a-input v-model="form.description" placeholder="描述" :maxLength="200" />
      </a-form-model-item>
      <a-form-model-item label="英文描述" prop="description_en" v-else>
        <a-input v-model="form.description_en" placeholder="英文描述" :maxLength="200" />
      </a-form-model-item>
      <a-form-model-item label="类型" prop="type">
        <a-select v-model="form.type" placeholder="类型">
          <a-select-option :value="2">图片</a-select-option>
          <a-select-option :value="1">链接</a-select-option>
          <a-select-option :value="3">其他</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="图片" required v-if="form.type==2 || form.type==3">
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :remove="hanldeImgRemove"
          @preview="handlePreview"
          :customRequest="handleUploadChange"
          class="upload-half"
          accept="image/*,video/*"
        >
          <div class="custom-btn" v-if="fileList.length<1">
            <a-icon type="ant-cloud" style="font-size: 26px" />
            <div class="ant-upload-text">上传图片/视频</div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="链接" v-if="form.type==1||form.type==3">
        <a-input v-model="form.url" placeholder="链接" />
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
      <img alt="example" style="width: 100%" :src="previewImage" v-if="previewImage.indexOf('.mp4') == -1" />
      <video :src="previewImage" v-else controls style="width: 100%"></video>
    </a-modal>
  </a-drawer>
</template>

<script>

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
import { updateHOmePageList,addHomePageInfo } from '@/api/manage'
import { showMessage } from '@/utils/mixins'
import { uploadFile, deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'

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
      title: '',
      tabkey: '1',
      visible: false,
      labelCol: {span: 3},
      wrapperCol: {span: 21},
      form: {
        screen: undefined,
        title: undefined,
        title_en: undefined,
        type: undefined,
        url: undefined,
        description: undefined,
        description_en: undefined,
        image_url: undefined
      },
      rules: {
        screen: [{required: true, message: '屏序号不能为空', trigger: 'blur'}],
        title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
        title_en: [{required: true, message: '英文标题不能为空', trigger: 'blur'}],
        type: [{required: true, message: '类型不能为空', trigger: 'change'}],
        url: [{required: true, message: '链接不能为空', trigger: 'blur'}],
        description: [{required: true, message: '描述不能为空', trigger: 'blur'}],
        description_en: [{required: true, message: '英文描述不能为空', trigger: 'blur'}],
      },
      fileList: [],
      previewVisible: false,
      previewImage: '',
      id: undefined,
      status: undefined
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
          _this.form.image_url = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    //删除图片
    hanldeImgRemove(file) {
      this.fileList = []
    //  deleteFile({filePath: file.url}).then(res => {
    //     if(res.code == '0') {
    //       this.showMessage(res,() => {
    //         this.fileList = []
    //       })
    //     }
    //   })
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
          if(this.status == 1) {
            const data={
              title: this.form.title||'', //
              title_en: this.form.title_en||'', //
              url: this.form.url||'', // 链接地址
              image_url:  this.form.image_url||'', // 视频封面图片
              description:  this.form.description||'', // 描述
              description_en:  this.form.description_en||'', //
              screen: this.form.screen||'', // 第几屏
              type: this.form.type||'', // 1：按钮链接，2：图片链接，3：首页产品中心推荐产品
            }
// console.log('data :>> ', data);
// return  false;
            addHomePageInfo(data).then(res => {
              if(res.code == 200) {
                this.showMessage({code:200,message:'添加成功'},() => {
                  this.onClose()
                  this.parent.getList()
                })
              }
            })
          }else {
            const data={
              id:this.id,
              title: this.form.title||'', //
              title_en: this.form.title_en||'', //
              url: this.form.url||'', // 链接地址
              image_url:  this.form.image_url||'', // 视频封面图片
              description:  this.form.description||'', // 描述
              description_en:  this.form.description_en||'', //
              screen: this.form.screen||'', // 第几屏
              type: this.form.type||'', // 1：按钮链接，2：图片链接，3：首页产品中心推荐产品
            }
            updateHOmePageList(data).then(res => {
              if(res.code == 200) {
                this.showMessage({code:200,message:'修改成功'},() => {
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
      this.visible = false
      this.id = undefined
      for(const key in this.form) {
        this.form[key] = undefined
      }
      this.fileList = []
      this.tabkey = '1'
    }
  }
}
</script>

<style lang="less" scoped>
.plus-icon,
.minus-icon {
  font-size: 20px;
  margin-right: 6px;
  float: right;
  color: #F5222D;
  margin-top: 10px;
}
.minus-icon {
  color: #1890ff;
}
</style>