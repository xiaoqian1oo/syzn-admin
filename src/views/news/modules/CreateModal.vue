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
      <a-form-model-item label="新闻标题" prop="title" v-if="tabkey=='1'">
        <a-input v-model="form.title" placeholder="新闻标题" :maxLength="80" />
      </a-form-model-item>
      <a-form-model-item label="英文新闻标题" prop="title" v-else>
        <a-input v-model="form.title_en" placeholder="英文新闻标题" :maxLength="80" />
      </a-form-model-item>
      <a-form-model-item label="新闻封面图" required>
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
      <a-form-model-item label="新闻摘要" prop="description" v-if="tabkey == '1'">
        <a-textarea
          v-model="form.description"
          placeholder="新闻摘要"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :maxLength="255"
        />
      </a-form-model-item>
      <a-form-model-item label="英文新闻摘要" prop="description_en" v-else>
        <a-textarea
          v-model="form.description_en"
          placeholder="英文新闻摘要"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :maxLength="255"
        />
      </a-form-model-item>
      <a-form-model-item label="首页是否推荐" prop="home_recommend">
        <a-select v-model="form.home_recommend" placeholder="新闻类型" style="width:50%;">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="2">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="新闻类型" prop="type">
        <a-select v-model="form.type" placeholder="新闻类型" style="width:50%;">
          <a-select-option :value="1">公司新闻</a-select-option>
          <!-- <a-select-option :value="2">行内资讯</a-select-option> -->
          <a-select-option :value="3">使用案例</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="新闻内容" required v-if="tabkey=='1'">
        <wangEditor :value="form.content" @change="editorChange" id="content1"></wangEditor>
      </a-form-model-item>
      <a-form-model-item label="英文新闻内容" required v-else>
        <wangEditor :value="form.content_en" @change="editorChange1" id="content2"></wangEditor>
      </a-form-model-item>
      <a-form-model-item label="排序">
        <a-input-number style="width:100px" v-model="form.sort" :maxLength="10" />
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
import { addNews,updateNews } from '@/api/manage'
import { showMessage } from '@/utils/mixins'
import { uploadFile,deleteFile } from '@/api/common'
import { getFileName } from '@/utils/util'
import wangEditor from '@/components/Editor/WangEditor.vue'

export default {
  mixins: [showMessage],
  components: {
    wangEditor
  },
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
      title: '',
      labelCol: {span: 3},
      wrapperCol: {span: 21},
      form: {
        title: undefined,
        title_en: undefined,
        description: undefined,
        description_en: undefined,
        type: undefined,
        img:undefined,
        home_recommend: '',
        content: undefined,
        content_en: undefined,
        type:'',
        sort:'',
      },
      rules: {
        title: [{required: true, message: '新闻标题不能为空', trigger: 'blur'}],
        title_en: [{required: true, message: '英文新闻标题不能为空', trigger: 'blur'}],
        description: [{required: true, message: '新闻描述不能为空', trigger: 'blur'}],
        description_en: [{required: true, message: '英文新闻描述不能为空', trigger: 'blur'}],
        type: [{required: true, message: '新闻类型不能为空', trigger: 'change'}],
        home_recommend: [{required: true, message: '是否推荐到首页不能为空', trigger: 'change'}],
      },
      status: undefined,
      id: undefined,
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  methods: {
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
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
      console.log('file :>> ', file);
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
          _this.form.img = res.data.file
        }else {
          _this.$message.error(res.message)
        }
      })
    },
    editorChange(val) {
      this.form.content = val
    },
    editorChange1(val) {
      this.form.content_en = val
    },
    // 提交
    onSubmit () {

      this.$refs.ruleForm.validate(vaild => {
        if(vaild) {
          if(!this.form.img) {
            this.$message.warning('新闻图片不能为空！')
            return
          }
          if (this.status == 1) {
            const data = {
              type: this.form.type,   // 模块 1:公司新闻 2:行业资讯
              title: this.form.title || '',     // 标题
              title_en: this.form.title_en || '',      // 英文标题

              img: this.form.img,     // 图片地址
              description: this.form.description || '', // 描述
              description_en: this.form.description_en || '', // 描述
              content: this.form.content || '', // 内容
              content_en: this.form.content_en || '', // 内容
              home_recommend: this.form.home_recommend, // 是否首页推荐 1:是，2：否
              sort:this.form.sort||0,
            }

            addNews(data).then(res => {
              if(res.code==200){
                this.showMessage({code:200,message:'添加成功'}, () => {
                  this.onClose()
                  this.parent.getList()
                })
              }
            })
          } else {
            const data = {
              id: this.id,
              type: this.form.type,   // 模块 1:公司新闻 2:行业资讯
              title: this.form.title || '',     // 标题
              title_en: this.form.title_en || '',      // 英文标题

              img: this.form.img,     // 图片地址
              description: this.form.description || '', // 描述
              description_en: this.form.description_en || '', // 描述
              content: this.form.content || '', // 内容
              content_en: this.form.content_en || '', // 内容
              home_recommend: this.form.home_recommend, // 是否首页推荐 1:是，2：否
            }
            updateNews(data).then(res => {
              if (res.code == 200) {
                this.showMessage({code:200,message:'修改成功'}, () => {
                  this.onClose()
                  this.parent.getList()
                })
              } else {
                this.$message.error(res.message)
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
      for(const key in this.form) {
        this.form[key] = undefined
      }
      this.status = undefined
      this.visible = false
      this.id = undefined
      this.fileList = []
      this.tabkey = '1'
    }
  }
}
</script>