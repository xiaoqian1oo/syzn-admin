<template>
  <a-drawer
    :title="title"
    :closable="false"
    :maskClosable="false"
    width="60%"
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
      <a-form-model-item label="视频标题" prop="title" v-if="tabkey=='1'">
        <a-input v-model="form.title" placeholder="视频标题" :maxlength="50" />
      </a-form-model-item>
      <a-form-model-item label="英文视频标题" prop="title" v-else>
        <a-input v-model="form.title_en" placeholder="英文视频标题" :maxLength="80" />
      </a-form-model-item>
      <a-form-model-item label="视频所属" prop="belong_id">
        <a-select
          allowClear
          v-model="form.belong_id"
          show-search
          placeholder="视频所属"
          option-filter-prop="children"
          style="width: 50%"
          :filter-option="(input,option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
          @change="handleVideoChange"
        >
          <a-select-option :value="item.id" v-for="item of parent.productData" :key="item.id">{{ item.title }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="视频链接" prop="video_url">
        <a-input v-model="form.video_url" placeholder="视频链接" :maxlength="255"></a-input>
        <!-- <a-button type="primary" @click="handleAddClick">添加视频链接</a-button>
        <a-row :gutter="[20,20]" style="width: 60%;" v-for="(item,index) of videoUrlList" :key="index">
          <a-col :span="18">
            <a-input v-model="videoUrlList[index]"></a-input>
          </a-col>
          <a-col :span="4">
            <a-button type="danger" icon="minus" @click="handleDeleteClick(index)"></a-button>
          </a-col>
        </a-row> -->
      </a-form-model-item>
      <a-form-model-item label="视频封面图片">
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :remove="hanldeImgRemove"
          @preview="handlePreview"
          :customRequest="handleUploadImgClick"
          class="upload-half"
          accept="image/*"
        >
          <div class="custom-btn" v-if="fileList.length<1">
            <a-icon type="ant-cloud" style="font-size: 26px" />
            <div class="ant-upload-text">添加视频封面(比例16:9)</div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="是否推荐到首页">
        <a-select v-model="form.home_recommend" placeholder="是否推荐到首页" style="width:50%;">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="2">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="排序">
        <a-input-number v-model="form.sort" placeholder="排序" :maxlength="10"></a-input-number>
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
  </a-drawer>
</template>

<script>
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'
import { showMessage } from '@/utils/mixins'
import { addVideoItem,updateVideoItem } from '@/api/manage'

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
      title: '',
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      form: {
        title:undefined,
        title_en: undefined,
        belong_id: undefined,
        video_url: undefined,
        video_image_url: undefined,
        sort: 0,
        home_recommend: undefined
      },
      rules: {
        title_en: [{required: true, message: '英文视频标题不能为空', trigger: 'blur'}],
        title: [{ required: true, message: '视频标题不能为空', trigger: 'blur' }],
        belong_id: [{ required: true, message: '所属系列不能为空', trigger: 'blur' }],
        video_url: [{ required: true, message: '视频链接不能为空', trigger: 'blur' }],
        video_image_url: [{ required: true, message: '封面图片不能为空', trigger: 'blur' }],
        classify: [{ required: true, message: '所属系列不能为空', trigger: 'change' }],
      },
      videoUrlList: [],
      visible: false,
      status: undefined,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      id: undefined
    }
  },
  methods: {
    handleVideoChange(val) {
      if(!val) {
        this.form.belong_id = 0
      }else {
        this.form.belong_id = val
      }
    },
    //删除
    handleDeleteClick(index) {
      this.videoUrlList.splice(index,1)
    },
    // 添加视频链接
    handleAddClick() {
      this.videoUrlList.push('')
    },
    //判断资源类型
    judgeSourceType(url) {
      if(/\.(png|jpg|gif|jpeg|webp)$/.test(url)) {
        return true
      }else {
        return false
      }
    },
    // 删除视频封面
    hanldeImgRemove(file) {
      this.fileList = []
            this.form.video_image_url = ''
            return
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          // const _index = this.fileList.findIndex(item => item == file.url)
          this.showMessage(res,() => {
            this.fileList = []
            this.form.video_image_url = ''
            // this.fileList.splice(_index,1)
            // const _temp = []
            // this.fileList.forEach(item => _temp.push(item.url))
            // this.form.video_image_url = _temp.join(',')
          })
        }
      })
    },
   
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    //自定义上传图片
    handleUploadImgClick(file) {
      const _this = this
      const formdata = new FormData()
      formdata.append('file', file.file)
      uploadFile(formdata).then(res => {
        if(res.code == 200) {
          file.url = res.data.file
          file.uid = Math.random()
          file.fileame = getFileName( res.data.file )
          _this.fileList.push(file)
          // _this.form.images.push(res.data)
          _this.form.video_image_url = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    // 关闭
    onClose() {
      this.visible = false
      this.fileList = []
      this.videoUrlList = []
      this.status = undefined
      this.id = undefined
      for(const key in this.form) {
        if(key == 'sort') {
          this.form[key] = 0
        }else {
          this.form[key] = undefined
        }
      }
    },
    // 提交
    onSubmit() {
      // console.log('this.form.belong_id :>> ', this.form.belong_id);
      // return false;
      this.$refs.ruleForm.validate((vaild) => {
        if (vaild) {
          // this.form.videoUrl = this.videoUrlList.join(',')
          // const _arrs = []
          // this.fileList.forEach(item =>  _arrs.push(item.url))
          // this.form.video_image_url =_arrs.join(',')

          if(!this.form.video_image_url) return this.$message.warning('视频封面不能为空')


          if(this.status == 1) {
            const data={
              title:this.form.title||'',
              title_en: this.form.title_en || '',      // 英文标题
              home_recommend:this.form.home_recommend||2,
              video_url:this.form.video_url||'',
              video_image_url:this.form.video_image_url||'',
              belong_id:this.form.belong_id||'',
              sort:this.form.sort||0,
            }
            addVideoItem(data).then(res => {
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
              title_en: this.form.title_en || '',      // 英文标题
              home_recommend:this.form.home_recommend||2,
              video_url:this.form.video_url||'',
              video_image_url:this.form.video_image_url||'',
              belong_id:this.form.belong_id||'',
              sort:this.form.sort||0,
            }
            updateVideoItem(data).then(res => {
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