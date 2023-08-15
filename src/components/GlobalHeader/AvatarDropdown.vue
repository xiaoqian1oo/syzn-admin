<template>
  <div>
    <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-avatar
          size="small"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar"
        />
        <span>{{ currentUser.name }}</span>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <a-menu-item key="changePassword" @click="handleChangePassword">
            <a-icon type="lock" />
            修改密码
          </a-menu-item>
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            退出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
    <a-modal
      title="修改密码"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="visible=false"
    >
      <a-form-model :model="form">
        <a-form-model-item label="新密码">
          <a-input-password v-model="form.password1" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item label="确认密码">
          <a-input-password v-model="form.password2" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input-password>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import storage from 'store'
import { updateUserPassword } from '@/api/manage'
import { showMessage } from '@/utils/mixins'

export default {
  name: 'AvatarDropdown',
  mixins: [showMessage],
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {}
    }
  },
  watch: {
    visible(val) {
      if(!val) {
        for(const key in this.form) {
          this.form[key] = undefined
        }
      }
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    // 提交
    handleOk() {
      const _this = this 
      this.confirmLoading = true
      const obj={
        ...this.form,
        account:storage.get('account')
      }
      updateUserPassword(obj).then((res) => {
        this.confirmLoading = false
        if(res.code == 200){
          _this.$store.dispatch('Logout').then((res) => {
            if (res.code == '0') {
              this.$message.success('密码修改成功，请重新登录')
              setTimeout(() => {
                this.visible = false
                storage.clearAll()
                _this.$router.replace({ path: '/user/login' })
                location.reload()
              },1500)
            }
          })
        }
      })
    },
    handleChangePassword() {
      this.visible = true
    },
    handleLogout(e) {
      const _this = this
      this.$confirm({
        title: '退出提醒',
        content: '您确定要退出系统吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          _this.$store.dispatch('Logout').then((res) => {
            if (res.code == '0') {
              storage.clearAll()
              _this.$router.replace({ path: '/user/login' })
              location.reload()
            }
          })
        },
      })
    },
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
