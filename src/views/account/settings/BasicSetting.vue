<template>
  <div class="account-settings-info-view">
    <a-tabs v-model="tabkey">
      <a-tab-pane key="1" tab="中文"></a-tab-pane>
      <a-tab-pane key="2" tab="英文" :forceRender="true"></a-tab-pane>
    </a-tabs>
    <a-row :gutter="16" type="flex">
      <a-col :order="isMobile ? 2 : 1" :md="16" :lg="16">
        <a-form layout="vertical" :form="form">
          <a-form-item label="公司名称" v-if="tabkey=='1'">
            <a-input placeholder="公司名称" v-model="form.name" :maxlength="80" />
          </a-form-item>
          <a-form-item label="英文公司名称" v-else>
            <a-input placeholder="英文公司名称" v-model="form.name_en" :maxlength="80" />
          </a-form-item>
          <a-form-item label="公司地址" v-if="tabkey=='1'">
            <a-input placeholder="公司地址" v-model="form.address" :maxlength="200" />
          </a-form-item>
          <a-form-item label="英文公司地址" v-else>
            <a-input placeholder="英文公司地址" v-model="form.address_en" :maxlength="200" />
          </a-form-item>
          <a-form-item label="公司成立时间">
            <a-date-picker v-model="form.establish_date" valueFormat="YYYY-MM-DD" style="width:50%" />
          </a-form-item>
          <a-form-item label="客服QQ">
            <a-input-number placeholder="客服QQ" v-model="form.qq" style="width:50%;" :maxlength="20" />
          </a-form-item>
          <a-form-item label="服务热线">
            <a-input placeholder="服务热线" v-model="form.tel" style="width: 100%" :maxlength="30" />
          </a-form-item>
          <a-form-item label="网站seo关键字">
            <a-input placeholder="seo关键字" v-model="form.seo_keyword" :maxlength="150" />
          </a-form-item>
          <a-form-item label="网站seo描述">
            <a-textarea
              v-model="form.seo_description"
              placeholder="网站seo描述"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="200"
            />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input placeholder="邮箱" v-model="form.email" :maxlength="30" />
          </a-form-item>
          <a-form-item label="公司Logo1">
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
          </a-form-item>
          <a-form-item label="公司Logo2">
            <a-upload
              list-type="picture-card"
              :file-list="fileList2"
              :remove="hanldeImgRemove2"
              @preview="handlePreview"
              :customRequest="handleUploadChange2"
              class="upload-half"
              accept="image/*"
            >
              <div class="custom-btn" v-if="fileList2.length<1">
                <a-icon type="ant-cloud" style="font-size: 26px" />
                <div class="ant-upload-text">添加图片</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="商城二维码">
            <div class="ant-upload-preview" @click="$refs.modal.edit(2)">
              <a-icon type="cloud-upload-o" class="upload-icon" />
              <div class="mask">
                <a-icon type="plus" />
              </div>
              <img v-if="option.img2" :src="option.img2" />
            </div>
          </a-form-item>
          <a-form-item label="二维码">
            <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
              <a-icon type="cloud-upload-o" class="upload-icon" />
              <div class="mask">
                <a-icon type="plus" />
              </div>
              <img v-if="option.img" :src="option.img" />
            </div>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="hanldeUpdateClick">更新基本设置</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setavatar" />
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="60%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { showMessage } from '@/utils/mixins'
import { getCompanyDetail,updateCompanyInfo } from '@/api/manage'
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'

export default {
  mixins: [baseMixin,showMessage],
  components: {
    AvatarModal
  },
  data () {
    return {
      tabkey: '1',
      preview: {},
      form: {
        id:'',
        qq: undefined,
        name: undefined,
        name_en: undefined,
        establish_date: undefined,
        tel: undefined,
        logo: undefined,
        logo_mobile: undefined,
        address: undefined,
        address_en: undefined,
        email: undefined,
        wx_code: undefined,
        seo_keyword: undefined,
        seo_description: undefined,
        shop_code: undefined
      },
      option: {
        img: '',
        img2: '',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      fileList: [],
      fileList2: [],
      previewVisible: false,
      previewImage: '',
    }
  },
  methods: {
    // 公司logo 2
    handleUploadChange2(file) {
      file = file.file
      const _this = this
      const formdata = new FormData()
      formdata.append('file', file)
      uploadFile(formdata).then(res => {
        if(res.code == 200) {
          file.url = res.data.file
          file.uid = Math.random()
          file.fileame = getFileName( res.data.file )
          _this.fileList2.push(file)
          _this.form.logo_mobile = res.data.file
        }else {
          _this.$message.error(res.message)
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
          _this.form.logo = res.data.file
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
    // 删除公司2
    hanldeImgRemove2() {
      this.fileList2 = []
            this.form.logo_mobile = ''
      return 
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          this.showMessage(res,() => {
            this.fileList2 = []
            this.form.logo_mobile = ''
          })
        }
      })
    },
    //删除图片
    hanldeImgRemove(file) {
      this.form.logo = ''
            this.fileList = []
      return
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          this.showMessage(res,() => {
            this.form.logo = ''
            this.fileList = []
          })
        }
      })
    },
    setavatar (url,id) {
      if(id == 1) {
        this.form.wx_code = url
        this.option.img = url
      }else {
        this.form.shop_code = url
        this.option.img2 = url
      }
    },
    // 获取公司介绍
    getCompanyDetail() {
      getCompanyDetail().then(res => {

        if(res.code == 200) {
          for(const key in this.form) {
            this.form[key] = res.data[key]
          }
          if(res.data.logo) {
            this.fileList = [
              {uid: Math.random(),name: getFileName(res.data.logo),url: res.data.logo}
            ]
          }
          if(res.data.logo_mobile) {
            this.fileList2 = [
              {uid: Math.random(),name: getFileName(res.data.logo_mobile),url: res.data.logo_mobile}
            ]
          }
          this.option.img = res.data.wx_code || ''
          this.option.img2 = res.data.shop_code || ''
        }
      })
    },
    // 更新公司介绍
    hanldeUpdateClick() {
      this.loading = true
      updateCompanyInfo(this.form).then(res => {
        this.loading = false
        if(res.code == 200) {
          this.showMessage({code:200,message:'设置成功'},this.getCompanyDetail)
        }
      })
    }
  },
  mounted() {
    this.getCompanyDetail()
    this.tabkey = '1'
  }
}
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  width: 120px;
  box-shadow: 0 0 4px #ccc;
  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }
  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    overflow: hidden;
  }

}
</style>
