<template>
  <div class="account-settings-info-view">
    <a-tabs v-model="tabkey">
      <a-tab-pane key="1" tab="中文"></a-tab-pane>
      <a-tab-pane key="2" tab="英文" :forceRender="true"></a-tab-pane>
    </a-tabs>
    <a-row :gutter="16" type="flex">
      <a-col :order="isMobile ? 2 : 1" :md="16" :lg="16">
        <a-form layout="vertical" :form="form">
          <a-form-item label="公司简介" v-if="tabkey=='1'">
            <a-textarea
              v-model="form.profile"
              placeholder="公司简介"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="2000"
            />
          </a-form-item>
          <a-form-item label="英文公司简介" v-else>
            <a-textarea
              v-model="form.profile_en"
              placeholder="英文公司简介"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="2000"
            />
          </a-form-item>
          <!-- <a-form-item label="公司描述">
            <a-textarea
              v-model="form.description"
              placeholder="公司描述"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-item> -->
          <a-form-item label="价值观" v-if="tabkey=='1'">
            <a-input v-model="form.worth" placeholder="价值观" :maxlength="80" />
          </a-form-item>
          <a-form-item label="英文价值观" v-else>
            <a-input v-model="form.worth_en" placeholder="英文价值观" :maxlength="80" />
          </a-form-item>
          <a-form-item label="企业文化" v-if="tabkey=='1'">
            <a-textarea
              v-model="form.corporate_culture"
              placeholder="企业文化"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="2000"
            />
          </a-form-item>
          <a-form-item label="英文企业文化" v-else>
            <a-textarea
              v-model="form.corporate_culture_en"
              placeholder="英文企业文化"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="2000"
            />
          </a-form-item>
          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item label="办事处多年行业经验技术团队">
                <a-input-number
                  v-model="form.service_province"
                  placeholder="技术团队数量"
                  style="width:100%;"
                  :maxlength="10"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="省市自治区的产品和服务覆盖">
                <a-input-number
                  v-model="form.service_office"
                  placeholder="产品和服务覆盖数量"
                  style="width:100%;"
                  :maxlength="10"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-model-item label="售前技术团队电话">
                <a-input v-model="form.service_pre_sales_technical_team_tel" style="width: 100%" placeholder="售前技术团队电话" :maxlength="30" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="售后技术团队电话">
                <a-input v-model="form.service_after_sales_technical_team_tel" style="width:100%" placeholder="售前技术团队电话" :maxlength="30"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-item label="备案号">
            <a-input v-model="form.record" placeholder="备案号" :maxlength="100" />
          </a-form-item>
          <a-form-item label="公司荣誉配图">
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
          <a-form-item label="企业文化配图">
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
          <a-form-item>
            <a-button type="primary" @click="hanldeUpdateClick" :loading="loading">更新公司介绍</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="60%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { getCompanyDetail,updateCompanyInfo } from '@/api/manage'
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'
import { baseMixin } from '@/store/app-mixin'
import { showMessage } from '@/utils/mixins'

export default {
  mixins: [baseMixin,showMessage],
  data () {
    return {
      tabkey: '1',
      form: {
        id:'',
        profile: undefined,
        profile_en: undefined,
        corporate_culture: undefined,
        corporate_culture_en: undefined,
        corporate_culture_image: undefined,
        service_province: undefined,
        service_pre_sales_technical_team_tel: undefined,
        service_after_sales_technical_team_tel: undefined,
        service_office: undefined,
        worth: undefined,
        worth_en: undefined,
        // description: undefined,
        record: undefined,
        honor: undefined
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileList2: [],
      userInfo: null,
      loading: false
    }
  },
  methods: {
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    //删除图片
    hanldeImgRemove(file) {
      this.fileList = []
      return
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          this.showMessage(res,() => {
            this.fileList = []
          })
        }
      })
    },
        //删除图片
        hanldeImgRemove2(file) {
      this.fileList2 = []
      return
      deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          this.showMessage(res,() => {
            this.fileList2 = []
          })
        }
      })
    },
    // 上传公司荣誉配图
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
          _this.form.honor = res.data.file
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
          _this.form.corporate_culture_image = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取公司介绍
    getCompanyDetail() {
      getCompanyDetail().then(res => {
//     {
    //   name: '',
    //   id: 1,
    //   name_en: undefined,
    //   tel: undefined,
    //   address: undefined,
    //   address_en: undefined,
    //   wx_code: undefined,
    //   shop_code: undefined,
    //   qq: undefined,
    //   email: undefined,
    //   profile: undefined,
    //   profile_en: undefined,
    //   corporate_culture: undefined,
    //   corporate_culture_en: undefined,
    //   corporate_culture_image: undefined,
    //   description: undefined,
    //   description_en: undefined,
    //   establish_date: undefined,
    //   service_province: undefined,
    //   service_office: undefined,
    //   seo_keyword: undefined,
    //   seo_description: undefined,
    //   logo: undefined,
    //   logo_mobile: undefined,
    //   worth: undefined,
    //   worth_en: undefined,
    //   service_pre_sales_technical_team_tel: undefined,
    //   service_after_sales_technical_team_tel: undefined,
    //   record: undefined,
    //   honor: undefined,
    //   created_at: 2023-03-20T02:27:08.802Z,
    //   updated_at: 2023-03-20T02:27:08.802Z
    // }

        if(res.code == 200) {
          for(const key in this.form) {
            this.form[key] = res.data[key]
          }
          if(res.data.corporate_culture_image) {
            this.fileList = [{
              uid: Math.random(),
              url: res.data.corporate_culture_image
            }]
          }
          if(res.data.honor) {
            this.fileList2 = [{
              uid: Math.random(),
              url: res.data.honor
            }]
          }
          
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

<style lang="less">

.custom-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
