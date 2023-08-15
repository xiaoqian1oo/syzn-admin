<template>
  <div :class="prefixCls">
    <div :id="id" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
const { $, BtnMenu } = WEditor
import { colors, faceImg } from './config'
import { uploadFile } from '@/api/common'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: [String, Number]
    },
    id: {
      type: String,
      default: 'editor',
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  watch: {
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
  },
  mounted () {
    console.log(this.id)
    this.initEditor()
  },
  methods: {
    initEditor () {
      const _this = this
      class AlertMenu extends BtnMenu {
        constructor(editor) {
          const $elem = WEditor.$(
            `<div class="w-e-menu" data-title="转化代码">
              <i class="iconfont icon-daima"></i>
            </div>`)
          super($elem, editor)
        }
        clickHandler() {
          _this.showSource()
          this.tryChangeActive()
        }
        tryChangeActive() {
          if (_this.isHTML) this.active()
          else this.unActive()
        }
      }
      const _editor = document.querySelector('#'+this.id)
      this.editor = new WEditor(_editor)
      const menuKey = 'compileCodeKey' // 菜单 key ，各个菜单不能重复
      this.editor.menus.extend('compileCodeKey', AlertMenu)
      this.editor.config.menus = this.editor.config.menus.concat(menuKey)
      // 将图片大小限制为 100M
      this.editor.config.uploadImgMaxSize = 100 * 1024 * 1024 
      // this.editor.onchangeTimeout = 200
      this.editor.config.colors = colors
      this.editor.config.emotions = faceImg
      //自定义上传图片
      this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // 下面上传接口替换为你自己的服务器接口
        for(let i=0;i<resultFiles.length;i++) {
          var formdata = new FormData()
          formdata.append('file', resultFiles[i])
          uploadFile(formdata).then((res) => {
            if (res.code == 200) {
              insertImgFn(res.data.file)
            } else {
              _this.$message.error(res.message)
            }
          })
        }
      }
      //自定义上传视频
      this.editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
        var formdata = new FormData()
        formdata.append('file', resultFiles[0])
        uploadFile(formdata).then((res) => {
          if (res.code == '0') {
            insertVideoFn(process.env.VUE_APP_API_ORIGIN+res.data)
          } else {
            _this.$message.error(res.data.message)
          }
        })
      }
      this.editor.config.onchange = (html) => {
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }
      this.editor.create()
      this.value && this.editor.txt.html(this.value)
    },
    //展示源码
    showSource() {
      const _this = this
      const _editor = _this.editor
      _this.isHTML = !_this.isHTML
      let _source = _editor.txt.html()
      if (_this.isHTML) {
        _source = _source.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;')
      } else {
        _source = _editor.txt
          .text()
          .replace(/&lt;/gi, '<')
          .replace(/&gt;/gi, '>')
          .replace(/&nbsp;/gi, ' ')
      }
      _editor.txt.html(_source)
      return _source
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
/deep/.w-e-droplist {
  max-height: 300px;
  overflow-y: auto;
}
/deep/.w-e-text-container {
  min-height: 400px !important;
}
.w-e-text-container ul {
  list-style: disc !important;
}
.w-e-text-container ol {
  list-style: auto !important;
}

.wang-editor {
  .w-e-text-container {
    // 文本框里面的层级调低
    z-index: 1 !important;
  }
  .w-e-toolbar {
    // 给工具栏换行
    flex-wrap: wrap;
  }
  .w-e-menu {
    // 最重要的一句代码
    z-index: auto !important;

    .w-e-droplist {
      // 触发工具栏后的显示框调高
      z-index: 2 !important;
    }
  }
}
</style>
