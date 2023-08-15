<template>
  <a-drawer
    :title="title"
    :closable="false"
    :maskClosable="false"
    width="70%"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
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
      <a-form-model-item label="产品名称" prop="title" v-if="tabkey=='1'">
        <a-input v-model="form.title" placeholder="产品名称" :maxlength="50" />
      </a-form-model-item>
      <a-form-model-item label="英文产品名称" prop="title_en" v-else>
        <a-input v-model="form.title_en" placeholder="英文产品名称" :maxlength="50" />
      </a-form-model-item>
      <a-form-model-item label="产品描述" prop="description" v-if="tabkey=='1'">
        <a-textarea v-model="form.description" placeholder="产品描述" :auto-size="{ minRows: 3, maxRows: 5 }" :maxlength="255" />
      </a-form-model-item>
      <a-form-model-item label="英文产品描述" prop="description_en" v-else>
        <a-textarea v-model="form.description_en" placeholder="英文产品描述" :auto-size="{ minRows: 3, maxRows: 5 }" :maxlength="255" />
      </a-form-model-item>
      <a-form-model-item label="所属系列" prop="classify">
        <a-select
          v-model="form.classify"
          show-search
          placeholder="选择系列"
          option-filter-prop="children"
          allowClear
          style="width: 300px"
          :filter-option="(input,option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
        >
          <a-select-option :value="item.id" v-for="item of classifyMenuTree" :key="item.id">{{ item.title }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="产品图片" required>
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :remove="hanldeImgRemove"
          :openFileDialogOnClick="false"
          @preview="handlePreview"
          class="upload-half"
          accept="image/*"
        >
          <div @click="handleUploadImgClick" class="custom-btn">
            <a-icon type="ant-cloud" style="font-size: 26px" />
            <div class="ant-upload-text">添加图片 (600*600)</div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="产品详情" v-if="tabkey=='1'">
        <wangEditor :value="form.content" @change="editorChange" id="editor1"></wangEditor>
      </a-form-model-item>
      <a-form-model-item label="英文产品详情" v-else>
        <wangEditor :value="form.content_en" @change="editorChange1" id="editor2"></wangEditor>
      </a-form-model-item>
      <a-form-model-item label="首页是否推荐" prop="home_recommend">
        <a-select v-model="form.home_recommend" placeholder="新闻类型" style="width:50%;">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="2">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="排序">
        <a-input-number style="width:100px" v-model="form.sort" :maxlength="10" />
      </a-form-model-item>
      <a-form-model-item label="seo关键字">
        <a-input placeholder="最多32个汉字" v-model="form.seo_keyword" :maxlength="100"></a-input>
      </a-form-model-item>
      <a-form-model-item label="seo描述">
        <a-textarea
          v-model="form.seo_description"
          placeholder="seo描述"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :maxlength="150"
        />
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
      <img alt="example" style="width: 100%" :src="previewImage | filterUrl" v-if="judgeSourceType(previewImage)" />
      <video :src="previewImage | filterUrl" style="width: 100%" controls v-else></video>
    </a-modal>
    <!-- 图片裁剪框 -->
    <a-modal
      title="裁切图片"
      :visible="cropperVisible"
      width="950px"
      :maskClosable="false"
      :keyboard="false"
      @cancel="handleCropperCancel"
      @ok="handleLimitImgClick"
      :confirmLoading="imgConfirmLoading"
    >
      <a-cropper
        :key="cropperVisible"
        ref="cropperNewsImg"
        :scale="[4, 4]"
        :width="240"
        :hegiht="240"
        imgName="选择图片"
        :size="2"
        @upload="handleUploadChange"
      ></a-cropper>
    </a-modal>
  </a-drawer>
</template>

<script>
import wangEditor from '@/components/Editor/WangEditor.vue'
import CropperImage from '@/components/CropperImage'
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'
import { showMessage } from '@/utils/mixins'
import { addProduct,updateProduct,getProductImgs,deleteProductImgs } from '@/api/manage'

export default {
  mixins: [showMessage],
  props: {
    parent: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    CropperImage,
    wangEditor,
  },
  data() {
    return {
      tabkey: '1',
      title: '',
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      form: {
        title: undefined,
        title_en: undefined,
        description: undefined,
        description_en: undefined,
        content: undefined,
        content_en: undefined,
        classify: undefined,
        seo_keyword: undefined,
        seo_description: undefined,
        sort: undefined,
        images: [],
        home_recommend:undefined
      },
      rules: {
        title: [{ required: true, message: '产品标题不能为空', trigger: 'blur' }],
        title_en: [{ required: true, message: '英文产品标题不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }],
        description_en: [{ required: true, message: '英文产品描述不能为空', trigger: 'blur' }],
        classify: [{ required: true, message: '所属系列不能为空', trigger: 'change' }],
      },
      visible: false,
      status: undefined,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      cropperVisible: false,
      imgConfirmLoading: false,
      id: undefined
    }
  },
  computed:{
    classifyMenuTree:function(){
      return this.parent.menuTree||[]
    }
  },
  watch: {
    visible(val) {
      if(val && this.id) {
        return;
        getProductImgs({productId: this.id}).then(res => {
          if(res.code == 200) {
            res.data.forEach(item => {
              this.fileList.push({
                uid: item.id,
                id: item.id,
                url: item.url.indexOf('http')!=-1 || item.url.indexOf('https')!=-1?item.url:process.env.VUE_APP_API_ORIGIN+item.url,
                name: getFileName(item.url)
              })
              this.form.images.push(item.url)
            })
          }
        })
      }
    }
  },
  methods: {
    //判断资源类型
    judgeSourceType(url) {
      if(/\.(png|jpg|gif|jpeg|webp)$/.test(url)) {
        return true
      }else {
        return false
      }
    },
    
    // 输入框
    editorChange(val) {
      this.form.content = val
    },
    editorChange1(val) {
      this.form.content_en = val
    },
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    //点击上传图片
    handleUploadImgClick() {
      this.cropperVisible = true
    },
    //关闭裁剪框
    handleCropperCancel() {
      this.cropperVisible = false
    },
    //裁剪框点击上传图片
    handleLimitImgClick() {
      this.imgConfirmLoading = true
      this.$refs.cropperNewsImg.getLimitedFile()
    },
    //删除图片
    hanldeImgRemove(file) {
      const _index = this.form.images.findIndex(item => file.url.indexOf(item) != -1 )
      this.form.images.splice(_index,1)
      this.fileList.splice(_index,1)
      return
      if(this.status == 1) {
        const _index = this.form.images.findIndex(item => file.url.indexOf(item) != -1 )
        this.form.images.splice(_index,1)
        deleteFile({filePath: file.url}).then(res => {
          if(res.code == '0') {
            this.showMessage(res,() => {
              this.fileList.splice(_index,1)
            })
          }
        })
      }else {
        if(!/\.(png|jpg|gif|jpeg|webp)$/.test(file.url) || !file.id) {
          const _index = this.form.images.findIndex(item => file.url.indexOf(item) != -1 )
          this.form.images.splice(_index,1)
          deleteFile({filePath: file.url}).then(res => {
            if(res.code == '0') {
              this.showMessage(res,() => {
                this.fileList.splice(_index,1)
              })
            }
          })
        }else {
          deleteProductImgs({id: file.id}).then(res => {
            if(res.code == '0') {
              const _index = this.fileList.findIndex(item => item.id == file.id)
              this.form.images.splice(_index,1)
              this.showMessage(res,() => {
                this.fileList.splice(_index,1)
              })
            }
          })
        }
      }
    },
    //自定义上传图片
    handleUploadChange(file) {
      const _this = this
      const formdata = new FormData()
      formdata.append('file', file)
      uploadFile(formdata).then(res => {
        if(res.code == 200) {
          file.url = res.data.file
          file.uid = Math.random()
          file.fileame = getFileName( res.data.file )
          _this.fileList.push(file)
          _this.form.images.push(res.data.file)
        }else {
          _this.$message.error(res.message)
        }
        this.imgConfirmLoading = false
        this.cropperVisible = false
      })
    },
    // 关闭
    onClose() {
      this.visible = false
      this.fileList = []
      this.fileList3 = []
      this.status = undefined
      this.id = undefined
      for(const key in this.form) {
        if(key == 'images') {
          this.form[key] = []
        }else {
          this.form[key] = undefined
        }
      }
      this.tabkey = '1'
    },
    // 提交
    onSubmit() {
      this.$refs.ruleForm.validate((vaild) => {
        if (vaild) {
          if(!this.form.images.length) {
            this.$message.warning('请添加产品图片')
            return
          }
          // if(!this.form.content || !this.form.content_en) {
          //   this.$message.warning('产品详情或者产品详情英文版不能为空')
          //   return
          // }
          if(this.status == 1) {
            const data={
              title:this.form.title||'',
              title_en:this.form.title_en||'',
              description:this.form.description||'',
              description_en:this.form.description_en||'',
              content:this.form.content||'',
              content_en:this.form.content_en||'',
              classify_id:this.form.classify||'',
              seo_keyword:this.form.seo_keyword||'',
              seo_description:this.form.seo_description||'',
              image_url:this.form.images.join(','),
              sort:this.form.sort||0,
              home_recommend:this.form.home_recommend||2,
            }

            addProduct(data).then(res => {
              if(res.code==200){
              this.showMessage({code:200,message:'添加成功'},() => {
                this.onClose()
                this.parent.getList()
              })                
              }
            })
          }else {
            const data={
              id: this.id,
              title:this.form.title||'',
              title_en:this.form.title_en||'',
              description:this.form.description||'',
              description_en:this.form.description_en||'',
              content:this.form.content||'',
              content_en:this.form.content_en||'',
              classify_id:this.form.classify||'',
              seo_keyword:this.form.seo_keyword||'',
              seo_description:this.form.seo_description||'',
              image_url:this.form.images.join(','),
              sort:this.form.sort||0,
              home_recommend:this.form.home_recommend||2,
            }
            updateProduct(data).then(res => {
              if(res.code==200){
              this.showMessage({code:200,message:'修改成功'},() => {
                this.onClose()
                this.parent.getList()
              })                
              }
            })
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less">
.ant-upload.ant-upload-disabled {
  cursor: pointer !important;
}
.ant-upload {
  position: relative;
  width: 100px !important;
  height: 100px !important;
}
.custom-btn {
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}
</style>