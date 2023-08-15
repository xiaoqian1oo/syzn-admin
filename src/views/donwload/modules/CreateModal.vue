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
      <a-form-model-item label="文件名" prop="name">
        <a-input v-model="form.name" placeholder="文件名" :maxLength="30" />
      </a-form-model-item>
      <!-- <a-form-model-item label="所属系列" prop="series">
        <a-select
          show-search
          placeholder="选择系列"
          option-filter-prop="children"
          allowClear
          style="width: 50%"
          v-model="form.series"
          :filter-option="(input,option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
        >
          <a-select-option :value="item.title" v-for="item of parent.menuTree" :key="item.id">{{ item.title }}</a-select-option>
        </a-select>
      </a-form-model-item> -->
      <!-- <a-form-model-item label="型号">
        <a-input v-model="form.model" placeholder="型号" style="width: 50%" />
      </a-form-model-item> -->
      <a-form-model-item label="上传附件" required>
        <a-upload
          :customRequest="handleUploadChange"
          :multiple="false"
          :file-list="fileList"
          :remove="hanldeImgRemove"
        >
          <a-button v-if="fileList.length<1"> <a-icon type="cloud-upload" /> 上传附件 </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="排序">
        <a-input-number style="width:100px" v-model="form.sort" />
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
  </a-drawer>
</template>

<script>
import { addInformation,updateInformation } from '@/api/manage'
import { showMessage } from '@/utils/mixins'
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'

export default {
  props: {
    parent: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [showMessage],
  data() {
    return {
      visible: false,
      title: '',
      labelCol: {span: 3},
      wrapperCol: {span: 21},
      form: {
        series: undefined,
        name: undefined,
        url: undefined,
        // model: undefined,
        sort:0,
      },
      rules: {
        name: [{required: true, message: '文件名不能为空', trigger: 'blur'}],
        type: [{required: true, message: '所属类型不能为空', trigger: 'change'}],
        series: [{required: true, message: '所属系列不能为空', trigger: 'change'}],
      },
      status: undefined,
      treeData: [],
      fileList: [],
      id: undefined
    }
  },
  methods: {
    // 删除图片
    hanldeImgRemove(file) {
      this.fileList = []
      // deleteFile({filePath: file.url}).then(res => {
      //   if(res.code == '0') {
      //     this.showMessage(res,() => {
      //       this.fileList = []
      //     })
      //   }
      // })
    },
    //自定义上传图片
    handleUploadChange(file) {
      const _this = this
      file = file.file
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
    // 提交
    onSubmit () {
      this.$refs.ruleForm.validate(vaild => {
        if(vaild) {
          if(!this.fileList.length) {
            this.$message.warning('附件不能为空！')
            return
          }
          if(this.status == 1) {
            const data={
              type:1,
              name:this.form.name||'',
              url:this.form.url||'',
              sort:this.form.sort||0,
            }

            addInformation(data).then(res => {
              if(res.code==200){
              this.showMessage({code:200,message:'添加成功'},() => {
                this.onClose()
                this.parent.getList()
              })
              }

            })  
          }else {
            const data={
              id:this.id,
              type:1,
              name:this.form.name||'',
              url:this.form.url||'',
              sort:this.form.sort||0,
            }
            updateInformation(data).then(res => {
              if(res.code==200){
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
      this.id = undefined
      this.status = undefined
      this.visible = false
      this.fileList = []
      for(const key in this.form) {
        this.form[key] = undefined
      }
    }
  }
}
</script>