<template>
  <a-drawer
    :title="title"
    :closable="false"
    :maskClosable="false"
    width="600px"
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
      <a-form-model-item label="登录账号" prop="account">
        <a-input v-model.trim="form.account" placeholder="登录账号" :maxlength="20"/>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password" v-if="status==1">
        <a-input-password placeholder="密码" v-model.trim="form.password" :maxlength="20"/>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="new_password" v-lse>
        <a-input-password placeholder="密码" v-model.trim="form.new_password" :maxlength="20" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status">
        <a-select v-model="form.status" placeholder="用户状态" style="width:200px;">
          <a-select-option :value="1">正常</a-select-option>
          <a-select-option :value="2">冻结</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="用户昵称" prop="username">
        <a-input v-model="form.username" placeholder="用户昵称" :maxlength="20" />
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
import { addUser,updateUser } from '@/api/manage'
import { showMessage } from '@/utils/mixins'

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
      visible: false,
      title: '',
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      form: {
        username: undefined,
        status: 1,
        password: undefined,
        account:undefined,
        new_password:undefined,
      },
      rules: {
        account: [{required: true, message: '登录账户不能为空', trigger: 'blur'}],
        status: [{required: true, message: '账户状态不能为空', trigger: 'change'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        username: [{required: true, message: '用户昵称不能为空', trigger: 'blur'}],
      },
      status: undefined,
      id: undefined,
    }
  },
  methods: {
    // 提交
    onSubmit () {
      this.$refs.ruleForm.validate(vaild => {
        if(vaild) {
          if(this.status == 1) {
            const data={
              username:this.form.username,
              account:this.form.account,
              password:this.form.password,
              status:this.form.status||1
            }

            addUser(data).then(res => {
              if(res.code==200){
                this.showMessage({code:200,message:'添加成功'}, () => {
                this.onClose()
                this.parent.getList()
              })
              }
              
            })
          }else {
            const data={
              id: this.id,
              username:this.form.username,
              account:this.form.account,
              password:this.form.new_password,
              status:this.form.status||1
            }
            if(!data.password) delete data.password;
            updateUser(data).then(res => {
              if(res.code==200){
                this.showMessage({code:200,message:'修改成功'}, () => {
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
      for(const key in this.form) {
        this.form[key] = undefined
      }
      this.status = undefined
      this.id = undefined
      this.visible = false
    }
  }
}
</script>