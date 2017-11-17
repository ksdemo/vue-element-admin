<template>
  <div slot="footer" class="dialog-footer" style="text-align: right">
    <el-form class="small-space" :inline="true" label-position="left" label-width="80px" style='display: inline-block;'>
      <el-form-item >
        <el-input style="width: 200px;" placeholder="管理员密码" :type="adminPasswordType" v-model="adminPassword">
        </el-input>
        <span class='show-pwd' @click='showAdminPassword'><icon-svg icon-class="eye" /></icon-svg></span>
      </el-form-item>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="handleEnter">确 定</el-button>
    </el-form>

  </div>
</template>

<script>
import {
  Message
} from 'element-ui'

import {
  validatePassword
} from '@/utils/validate'

export default {
  name: 'DialogFooterAdmin',
  data() {
    return {
      adminPasswordType: 'password'
    }
  },
  computed: {
    adminPassword: {
      get () {
        return this.$store.state.user.adminPassword
      },
      set (value) {
        this.$store.commit('SET_ADMINPASSWORD', value)
      }
    }
  },
  methods: {
    handleCancel() {
      this.adminPassword = ""
      this.$emit('oncancel')
    },
    handleEnter() {
      if(validatePassword(this.adminPassword)){
        this.$emit('onenter', this.adminPassword)
      }else {
        Message({
          message: '请输入管理员密码',
          type: 'error',
          duration: 2 * 1000
        })
        return false

      }
    },
    showAdminPassword() {
      this.adminPasswordType = this.adminPasswordType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$dark_gray:#889aa4;
div.ks-dialog-input:nth-child(2n+1) {
  margin-right: 60px !important;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
}
</style>
