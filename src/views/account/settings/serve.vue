<template>
  <div class="account-settings-info-view">
    <a-form-model 
      ref="ruleForm"
      :model="form" 
    >
      <a-form-model-item label="累积服务用户">
        <a-input-number v-model="form.serviceUser" placeholder="累积服务用户" style="width: 300px"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="技术团队">
        <a-input-number v-model="form.serviceTechnicalTeam" placeholder="技术团队" style="width: 300px"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="运营团队">
        <a-input-number v-model="form.serviceOperationTeam" placeholder="运营团队" style="width: 300px"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="服务内容">
        <a-textarea
          v-model="form.serviceContent"
          placeholder="服务内容"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="售前技术团队电话">
            <a-input v-model="form.servicePreSalesTechnicalTeamTel" style="width: 300px" placeholder="售前技术团队电话"/>
          </a-form-model-item>
          <a-form-model-item label="售前技术团队人数">
            <a-input-number style="width: 300px" v-model="form.servicePreSalesTechnicalTeamPeople" placeholder="售前技术团队人数"/>
          </a-form-model-item>
          <a-form-model-item label="售前技术团队简介">
            <a-textarea
              v-model="form.servicePreSalesTechnicalTeamProfile"
              placeholder="售前技术团队简介"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding-left:50px;">
          <a-form-model-item label="售后技术团队电话">
            <a-input v-model="form.serviceAfterSalesTechnicalTeamTel" style="width: 300px" placeholder="售前技术团队电话"/>
          </a-form-model-item>
          <a-form-model-item label="售后技术团队人数">
            <a-input-number style="width: 300px" v-model="form.serviceAfterSalesTechnicalTeamPeople" placeholder="售前技术团队人数"/>
          </a-form-model-item>
          <a-form-model-item label="售后技术团队简介">
            <a-textarea
              v-model="form.serviceAfterSalesTechnicalTeamProfile"
              placeholder="售后技术团队简介"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item label="服务背景图片">
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
            <div class="ant-upload-text">上传服务背景图片</div>
          </div>
        </a-upload>
        <a-button type="primary" @click="hanldeUpdateClick">更新服务保障</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="60%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { getCompanyDetail,updateCompanyInfo } from '@/api/manage'
import { getFileName } from '@/utils/util'

export default {
  name: 'Serve',
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImage: '',
      form: {
        serviceBg: undefined,
        serviceUser: undefined,
        serviceTechnicalTeam: undefined,
        serviceOperationTeam: undefined,
        serviceContent: undefined,
        servicePreSalesTechnicalTeamTel: undefined,
        servicePreSalesTechnicalTeamPeople: undefined,
        servicePreSalesTechnicalTeamProfile: undefined,
        serviceAfterSalesTechnicalTeamTel: undefined,
        serviceAfterSalesTechnicalTeamPeople: undefined,
        serviceAfterSalesTechnicalTeamProfile: undefined
      }
    }
  },
  methods: {
    //删除图片
    hanldeImgRemove(file) {
     deleteFile({filePath: file.url}).then(res => {
        if(res.code == '0') {
          this.showMessage(res,() => {
            this.fileList = []
          })
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
    //自定义上传图片
    handleUploadChange(file) {
      file = file.file
      const _this = this
      const formdata = new FormData()
      formdata.append('file', file)
      uploadFile(formdata).then(res => {
        if(res.code == '0') {
          file.url = process.env.VUE_APP_API_ORIGIN+res.data
          file.uid = Math.random()
          file.fileame = getFileName( res.data )
          _this.fileList.push(file)
          _this.form.serviceBg = res.data
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取公司介绍
    getCompanyDetail() {
      getCompanyDetail().then(res => {
        if(res.code == '0') {
          for(const key in this.form) {
            this.form[key] = res.data[key]
          }
          if(res.data.serviceBg) {
            this.fileList = [{
              uid: Math.random(),
              name: getFileName(res.data.serviceBg),
              url: process.env.VUE_APP_API_ORIGIN+res.data.serviceBg
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
        if(res.code == '0') {
          this.showMessage(res,this.getCompanyDetail)
        }
      })
    }
  },
  mounted() {
    this.getCompanyDetail()
  }
}
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 6px;
}
</style>