<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="账号/手机号" v-model="listQuery.clientName">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.roleId" placeholder="请选择角色">
        <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.name" :value="item.roleId">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="账号" width="150" >
        <template scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="150">
        <template scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" width="150">
        <template scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="150">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="150">
        <template scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template scope="scope">
          <el-tag :type="scope.row.state | statusTagFilter">{{scope.row.state | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleChangePassword(scope.row)">修改密码</el-button>
          <el-button size="small" type="danger" @click="handleChangeUserRole(scope.row)">修改角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 创建/编辑用户信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form class="small-space" :inline="true" :model="temp" :rules="createSysUserRules" label-position="left" label-width="80px" style='width: 650px; margin-left:50px;' ref="createSysUser">
        <el-form-item label="用户帐号" class="ks-dialog-input" prop='account'>
          <el-input v-model="temp.account"></el-input>
        </el-form-item> 
        <el-form-item v-if="dialogStatus=='create'" label="用户密码" class="ks-dialog-input" prop='password'>
          <el-input :type="createPasswordType" v-model="temp.password" autoComplete="off" placeholder="密码" />
          <span class='show-pwd' @click='showCreatePasswordType'><icon-svg icon-class="eye" /></icon-svg></span>
        </el-form-item>
        <el-form-item label="用户昵称" class="ks-dialog-input" prop='name'>
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" class="ks-dialog-input" prop='email'>
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="ks-dialog-input" prop='mobile'>
          <el-input  v-model="temp.mobile"></el-input>
        </el-form-item>
        <el-form-item label="分机号" class="ks-dialog-input" prop='phone'>
          <el-input  v-model="temp.phone"></el-input>
        </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'enterDialog'
        @oncancel= 'cancel'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 编辑用户状态-->
    <el-dialog title="修改帐号启用状态" :visible.sync="dialogModifyStatusVisible" @close="cancelModifyStatus">
      <el-form class="small-space" :model="temp" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
        <h3 color="red">温馨提示: 请慎重修改启用状态</h3>
        <el-form-item label="状态" class="ks-dialog-input" prop='clientState'>
          <el-select class="filter-item" v-model="temp.state" placeholder="请选择" style="width: 179px">
            <el-option v-for="item in  statusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'updateModifyStatus'
        @oncancel= 'cancelModifyStatus'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="changePasswordVisible" @close="cancelChangePassword">
      <el-form class="small-space" :model="changePasswordTemp" :rules="changePasswordRules" ref="changePassword" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="changePasswordTemp.password" auto-complete="off" style="width: 179px"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="changePasswordTemp.checkPass" auto-complete="off" style="width: 179px"></el-input>
          </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'updateChangePassword'
        @oncancel= 'cancelChangePassword'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 修改用户角色-->
    <el-dialog title="修改用户角色" :visible.sync="dialogUserRoleVisible" @close="cancelChangeUserRole">
      <el-form class="small-space" :model="temp" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
          <el-form-item label="用户角色" class="ks-dialog-input" prop='roleId'>
            <el-select style="width: 200px" class="filter-item" v-model="temp.roleId" placeholder="请选择">
              <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.name" :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
    <dialog-footer-admin slot="footer"
      @onenter = 'updateChangeUserRole'
      @oncancel= 'cancelChangeUserRole'
    >
    </dialog-footer-admin>
  </el-dialog>
    

  </div>
</template>
<script>

import {
  getSysUserList,
  getSysRoleList,
  createSysUser,
  updateSysUser,
  updateSysUserStatus,
  updateSysUserPass,
  updateSysUserRole
} from '@/api/sysUser.js'

import waves from '@/directive/waves/index.js' // 水波纹指令
import {
  parseTime
} from '@/utils'
import {
  validateRequired,
  validatePassword
} from '@/utils/validate'
import {
  compareObj,
  deepCloneJSON
} from '@/utils/common.js'

import {
  statusTypeOptions
} from '@/config'

const defaultTemp = {
  "update_time": "",
  "create_time": "",
  "user_id": "",
  "phone": "",
  "login_type": 0,
  "roleId": null,
  "mobile": "",
  "name": "",
  "roleName": "",
  "state": 0,
  "account": "",
  "email": "",
  "password": ""
}

function adapt(data) {
  return data;
}

export default {
  name: 'sysUserList',
  directives: {
    waves
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的帐号名称'))
      } else {
        callback()
      }
    }
    const validateUserPassword = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('请输入正确的帐号密码'))
      } else {
        callback()
      }
    }

    var validatePass = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('请输入正确的密码'))
      } else {
        if (this.changePasswordTemp.checkPass !== '') {
          this.$refs.changePassword.validateField('checkPass');
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordTemp.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      list: null,
      totalCount: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        roleId: undefined,
        clientName: undefined,
        sort: '+id'
      },
      oldTemp: '',
      temp: deepCloneJSON(defaultTemp),
      statusTypeOptions,
      roleOptions: [{
        name: '测试',
        roleId: 'test'
      }],
      sortOptions: [{
        label: '按ID升序列',
        key: '+id'
      }, {
        label: '按ID降序',
        key: '-id'
      }],
      dialogFormVisible: false,
      dialogStatus: '',
      dialogModifyStatusVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      createPasswordType: "password",
      tableKey: 0,
      createSysUserRules: {
        account: [{
          required: true,
          trigger: 'blur',
          validator: validateAccount
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validateUserPassword
        }]
      },
      /* 修改密码相关 S */
      changePasswordVisible : false,
      changePasswordTemp: {
        user_id: '',
        password: '',
        checkPass: ''
      },
      changePasswordRules: {
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        checkPass: [{
          required: true,
          trigger: 'blur',
          validator: validateCheckPass
        }]
      },
      /* 修改密码相关 E */
      /* 修改角色相关 S */
      dialogUserRoleVisible : false
      /* 修改角色相关 E */
    }
  },
  computed:{
    adminPassword(){
      return this.$store.state.user.adminPassword
    }
  },
  created() {
    this.getList()
    this.getSysRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysUserList(this.listQuery).then(response => {
        let data = adapt(response.data)
        this.list = data.data
        this.totalCount = data.totalCount
        this.listLoading = false
      })
    },
    getSysRoleList(){
      getSysRoleList().then(response => {
        this.roleOptions = response.data.data
        console.log(response)
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.oldTemp = deepCloneJSON(row)
      this.temp = deepCloneJSON(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    enterDialog(){
      if(this.dialogStatus=='create'){
        this.create()
      }else{
        this.update()
      }
    },
    create() {
      this.$refs.createSysUser.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = deepCloneJSON(this.temp)
          createForm.adminPassword = this.adminPassword

          this.cancel();
          console.log(createForm)
          createSysUser(createForm).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.getList()
          }).catch(() => {
            this.listLoading = false
            this.getList()
          })
        } else {
          console.log('表单验证未通过')
          return false
        }
      })
    },
    update() {
      this.$refs.createSysUser.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = deepCloneJSON(this.temp)
          var oldForm = deepCloneJSON(this.oldTemp)
          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            this.$notify({ title: '取消', message: '更新数据无变化', type: 'warning', duration: 2000 })
            return;
          }
          updateForm.adminPassword = this.adminPassword
          this.cancel();
          console.log(updateForm)
          updateSysUser(updateForm).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.getList()
          }).catch(() => {
            this.listLoading = false
            this.getList()
          })
        } else {
          console.log('表单验证未通过')
          return false
        }
      })
    },
    cancel() {
      this.resetTemp()
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = deepCloneJSON(defaultTemp)
      this.$store.commit('SET_ADMINPASSWORD', "")
    },
    handleModifyStatus(row) {
      this.resetTemp()
      this.oldTemp = deepCloneJSON(row)
      this.temp = deepCloneJSON(row)
      this.dialogModifyStatusVisible = true
    },
    cancelModifyStatus() {
      this.resetTemp();
      this.dialogModifyStatusVisible = false;
    },
    updateModifyStatus() {
      var updateForm = deepCloneJSON({
        user_id: this.temp.user_id,
        clientState: this.temp.state,
        adminPassword: this.adminPassword
      })
      if (compareObj(this.oldTemp.state, this.temp.state)) {
        this.cancelModifyStatus();
        console.log('更新状态无变化!!')
        return;
      }

      this.listLoading = true
      this.cancelModifyStatus();
      updateSysUserStatus(updateForm).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
        this.getList()
      }).catch(() => {
        this.listLoading = false
        this.getList()
      })
    },

    showCreatePasswordType() {
      this.createPasswordType = this.createPasswordType === 'password' ? 'text' : 'password'
    },

    /* 修改密码相关 S */
    resetChangePasswordTemp(){
      this.changePasswordTemp = {
        user_id: '',
        password: '',
        checkPass: ''
      }
    },
    handleChangePassword(row){
      this.resetChangePasswordTemp()
      this.changePasswordTemp.user_id = row.user_id
      this.changePasswordVisible = true
    },
    cancelChangePassword(){
      this.changePasswordVisible = false
      this.resetChangePasswordTemp()
    },
    updateChangePassword(){
      this.$refs.changePassword.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = deepCloneJSON(this.changePasswordTemp)
          updateForm.adminPassword = this.adminPassword
          this.cancelChangePassword();
          console.log(updateForm)
          updateSysUserPass(updateForm).then(() => {
            this.$notify({
              title: '成功',
              message: '密码修改成功',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.getList()
          }).catch(() => {
            this.listLoading = false
            this.getList()
          })
        } else {
          console.log('表单验证未通过')
          return false
        }
      })
    },
    /* 修改密码相关 E */
    /* 修改角色相关 共用 temp S */
    handleChangeUserRole(row){
      this.resetTemp()
      this.oldTemp = deepCloneJSON(row)
      this.temp = deepCloneJSON(row)
      this.dialogUserRoleVisible = true
    },
    cancelChangeUserRole(){
      this.resetTemp(),
      this.dialogUserRoleVisible = false
    },
    updateChangeUserRole(){
      var updateForm = deepCloneJSON({
        user_id: this.temp.user_id,
        roleId: this.temp.roleId,
        adminPassword: this.adminPassword
      })
      if (compareObj(this.oldTemp.roleId, this.temp.roleId)) {
        this.cancelChangeUserRole();
        console.log('更新状态无变化!!')
        return;
      }

      this.listLoading = true
      this.cancelChangeUserRole();
      updateSysUserRole(updateForm).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
        this.getList()
      }).catch(() => {
        this.listLoading = false
        this.getList()
      })
    },
    /* 修改角色相关 E */
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
