const toggleQuery = {
  data() {
    return {
      advanced: false
    }
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    }
  }
}

const showMessage = {
  methods: {
    showMessage(res, callback, errorCallback) {
      if (res.code == 200) {
        this.$message.success(res.message)
        callback && callback()
      } else {
        this.$message.warning(res.message)
        errorCallback && errorCallback()
      }
    }
  }
}

const beforeUpload = {
  methods: {
    beforeUpload() {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('图片格式不正确');
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片上传不能大于2M!');
      }
      return isJpgOrPng && isLt2M
    }
  }
}

//根据下载链接下载
const downLoadUrl = {
  methods: {
    downLoadUrl(url) {
      const _arr = url.split('/')
      const _title = _arr[_arr.length - 1]
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = _title
      a.target = '_blank'
      a.href = url
      a.click()
    }
  }
}


export {
  toggleQuery,
  showMessage,
  beforeUpload,
  downLoadUrl,
}