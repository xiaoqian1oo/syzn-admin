<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div class="cropper">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :height="option.height"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
          @imgLoad="imgLoad"
        >
        </vue-cropper>
      </div>
      <!--底部操作工具按钮-->
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">{{ imgName }}</label>
          <input
            type="file"
            id="uploads"
            style="position: absolute; clip: rect(0 0 0 0)"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="selectImg($event)"
          />
          <!-- <div class="scan-code" style="inline-block">
            <p v-if="isImgEmpty" class="empty-tip-text">系统未检测到图片，再试一次吧~</p>
            <a-upload-mobile type='PERSON' @handleUploadSuccess="handleUploadSuccess"></a-upload-mobile>
          </div> -->
          <a-button
            type="danger"
            plain
            @click="changeScale(1)"
            style="margin-right: 10px"
          >
            <a-icon type="zoom-in" /></a-button>
          <a-button
            type="danger"
            plain
            @click="changeScale(-1)"
            style="margin-right: 10px"
          >
            <a-icon type="zoom-out" /></a-button>
          <a-button
            type="danger"
            plain
            @click="rotateLeft"
            style="margin-right: 10px"
          >↺
          </a-button>
          <a-button type="danger" plain @click="rotateRight">↻
          </a-button>
        </div>
        <!-- <div class="upload-btn">
          <a-button  type="success" @click="uploadImg('blob')">上传封面
            <i class="el-icon-upload"></i>
          </a-button>
        </div> -->
      </div>
    </div>
    <!--预览效果图-->
    <div class="show-preview" v-if="screenWidth >= 992">
      <div :style="previews.div" class="preview">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'CropperImage',
  components: {
    VueCropper,
  },
  props: {
    cropperName: {
      type: String,
      default: '图片裁剪',
    },
    width: {
      type: [Number,String],
      default: 154
    },
    height: {
      type: [Number,String],
      default: 154
    },
    scale: {
      type: Array,
      default:() => [1, 1]
    },
    imgName: {
      type: String,
      default: '选择照片'
    },
    size: {
      type: Number,
      default: 100
    },
    canMove: {  
      type: Boolean,
      default: false
    },
    canMoveBox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const _this = this
    return {
      name: this.cropperName,
      previews: {},
      option: {
        img: '', //裁剪图片的地址
        outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg', //裁剪生成图片的格式（jpeg || png || webp）
        info: true, //图片大小信息
        canScale: true, //图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: _this.width, //默认生成截图框宽度230px
        autoCropHeight: _this.height, //默认生成截图框高度150
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: _this.scale, //截图框的宽高比例[1.53, 1]
        full: false, //false按原比例裁切图片，不失真
        fixedBox: true, //固定截图框大小，不允许改变
        canMove: _this.canMove, //上传图片是否可以移动
        canMoveBox: _this.canMoveBox, //截图框能否拖动
        original: false, //上传图片按照原始比例渲染
        centerBox: false, //截图框是否被限制在图片里面
        height: true, //是否按照设备的dpr 输出等比例图片
        infoTrue: true, //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, //限制图片最大宽度和高度
        enlarge: 5, //图片根据截图框输出比例倍数
        mode: '230px 150px', //图片默认渲染方式
      },
      isImgEmpty: false,
      fileName: '',
      fileType: '',
      screenWidth: 0
    }
  },
  methods: {
    handleUploadSuccess(res) {
      // console.log(res, 'res')
    },
    //初始化函数
    imgLoad(msg) {
      
    },
    getLimitedFile() {
      const _this = this
      this.$refs.cropper.getCropBlob( data => {
        const files = new window.File([data], _this.fileName, {type: _this.fileType})
        this.$emit('upload',files)
      })
    },
    //图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    //向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    //向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    //实时预览函数
    realTime(data) {
      this.previews = data
    },
    //选择图片
    selectImg(e) {
      const file = e.target.files[0]
      this.fileName = file.name
      this.fileType = file.type
      const limitSize = this.size * 1024 * 1024
      if(file.size > limitSize) {
        this.$message.warning('图片大小不能超过2M')
        return
      }
      if (
        !/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)
      ) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: 'error',
        })
        return false
      }
      //转化为blob
      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(
            new Blob([e.target.result])
          )
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      //转化为base64
      reader.readAsDataURL(file)
    },
    //上传图片
    // uploadImg (type) {
    //   const _this = this;
    //   if (type === 'blob') {
    //     //获取截图的blob数据
    //     this.$refs.cropper.getCropBlob(async (data) => {
    //       this.$emit('imgUpload',data)
    //     })
    //   }
    // },
  },
  mounted() {
    this.screenWidth = window.screen.width
  }
}
</script>

<style lang="less" scoped >

.cropper-content {
  display: flex;
  // display: -webkit-flex;
  justify-content: flex-end;
  .cropper-box {
    flex: 1;
    width: 100%;
    .cropper {
      width: auto;
      height: 300px;
    }
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    // display: -webkit-flex;
    justify-content: center;
    .preview {
      overflow: hidden;
      border: 1px solid #67c23a;
      background: #cccccc;
    }
  }
}
.footer-btn {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  .scope-btn {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding-right: 10px;
  }
  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    margin-right: 10px;
  }
}
</style>
