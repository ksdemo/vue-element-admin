<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="账号/手机号" v-model="listQuery.mainQuery">
      </el-input>
      <!-- 实名认证 S -->
      <el-select @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.isIdcardCert" placeholder="认证状态">
        <el-option v-for="item in idcardCertOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select v-show="listQuery.isIdcardCert == 1" @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.idcardCertState" placeholder="认证结果">
        <el-option v-for="item in idcardCertStateOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <!-- 实名认证 E -->
      <!-- 司机认证 S -->
      <el-select @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.isIdcardCert" placeholder="认证状态">
        <el-option v-for="item in idcardCertOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select v-show="listQuery.isIdcardCert == 1" @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.idcardCertState" placeholder="认证结果">
        <el-option v-for="item in idcardCertStateOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <!-- 司机认证 E -->

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
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
      <el-table-column align="center" label="昵称" width="150">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template scope="scope">
          <el-tag :type="scope.row.state | statusTagFilter">{{scope.row.state | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名认证" width="200">
        <template scope="scope">
          <el-tag class="cursor" @click.native="handleIdcardcert(scope.row)" :type="scope.row.is_idcard_cert | idcardCertTagFilter">{{scope.row.is_idcard_cert | idcardCertFilter }}</el-tag>
          <el-switch v-if="scope.row.is_idcard_cert == 1" v-model="scope.row.idcard_cert_state" :on-value="1" on-text="成功" :off-value="0" off-text="失败" @change="idcertChangeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleChangePassword(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 创建/编辑用户信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form class="small-space" :inline="true" :model="temp" :rules="createItcDriverRules" label-position="left" label-width="80px" style='width: 650px; margin-left:50px;' ref="createItcDriver">
        <el-form-item v-if="dialogStatus=='create'" label="用户帐号" class="ks-dialog-input" prop='account'>
          <el-input v-model="temp.account"></el-input>
        </el-form-item> 
        <el-form-item v-if="dialogStatus=='create'" label="用户密码" class="ks-dialog-input" prop='password'>
          <el-input :type="createPasswordType" v-model="temp.password" autoComplete="off" placeholder="密码" />
          <span class='show-pwd' @click='showCreatePasswordType'><icon-svg icon-class="eye" /></icon-svg></span>
        </el-form-item>
        <el-form-item label="用户昵称" class="ks-dialog-input" prop='name'>
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="ks-dialog-input" prop='mobile'>
          <el-input  v-model="temp.mobile"></el-input>
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
            <el-option v-for="item in  statusTypeOptions" :key="item.key" :label="item.label" :value="item.key">
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

    <!-- 创建/修改用户实名认证信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogIdcertVisible" @close="cancelIdcert">
      <el-form class="small-space" :model="idcertTemp" label-position="left" label-width="6em" style='width: 500px; margin-left:50px;'>
        <el-form-item label="姓名" prop="realname">
          <el-input type="text" v-model="idcertTemp.realname" auto-complete="off" style="width: 179px"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input type="text" v-model="idcertTemp.idNum" auto-complete="off" style="width: 179px"></el-input>
        </el-form-item>
        
      </el-form>
      <div style="margin-left: 50px; margin-right: 20px;">
        <!-- 
          <dropzone label-width="6em" v-on:dropzone-removedFile="idcardFaceImgR" v-on:dropzone-success="idcardFaceImgS" id="idcardFaceImg" label="身份证正面" url="/rest/file/credentialsUpload" :params="{'type' : 10}"></dropzone> 
        -->
        <image-upload 
          label-width="6em" 
          label="身份证正面" 
          :url= "BASE_API+'/rest/file/credentialsUpload'" 
          :params="{'type' : 10}" 
          :defaultImg="idcertTemp.faceImg" 
          box-width="500px" 
          img-width="400px"
          @oncancel="IDFaceCancel"
          @onsuccess="IDFaceSuccess"
          @onerror="IDFaceError"
        >
        </image-upload>
        <div style="height:20px"></div>
        <image-upload 
          label="身份证背面" 
          :url="BASE_API+'/rest/file/credentialsUpload'" 
          :params="{'type' : 11}" 
          :defaultImg="idcertTemp.backImg" 
          box-width="500px" 
          img-width="400px"
          @oncancel="IDBackCancel"
          @onsuccess="IDBackSuccess"
          @onerror="IDBackError"
        >
        </image-upload>
      </div>
    <dialog-footer-admin slot="footer"
      @onenter = 'enterIdcert'
      @oncancel= 'cancelIdcert'
    >
    </dialog-footer-admin>
  </el-dialog>
    

  </div>
</template>
<script>

import {
  getItcDriverList,
  createItcDriver,
  updateItcDriver,
  updateItcDriverStatus,
  updateItcDriverPass,

  getItcIdcertInfo,
  createItcIdcert,
  updateItcIdcert,
  updateItcIdcertState
} from '@/api/itc/itcDriver.js'


import {
  validateRequired,
  validatePassword
} from '@/utils/validate'

import {
  compareObj,
  cloneJSON
} from '@/utils/common.js'

import {
  statusTypeOptions,
  idcardCertOptions,
  idcardCertStateOptions
} from '@/config'

import Dropzone from '@/components/Dropzone/dailogDropzone.vue'
import ImageUpload from '@/utils/ksutils/imageUpload/index.vue'

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
const defaultIdcardCertTemp = {
  "user_id": "",
  "realname": "",
  "idNum": "",
  "faceImg": "",
  "backImg": "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=477576474,3698736735&fm=173&s=03E6DC054440F75156B8518E0300C091&w=600&h=431&img.JPEG"
}

function adapt(data) {
  return data;
}

export default {
  name: 'ItcDriverList',
  components: { 
    Dropzone
    , ImageUpload 
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
      BASE_API: process.env.BASE_API,
      list: null,
      totalCount: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        isIdcardCert: undefined,
        idcardCertState: undefined,
        mainQuery: undefined,
        sort: '+id'
      },
      oldTemp: {},
      temp: cloneJSON(defaultTemp),
      oldIdcertTemp : {},
      idcertTemp : cloneJSON(defaultIdcardCertTemp),
      statusTypeOptions,
      idcardCertOptions,
      idcardCertStateOptions,
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
      createItcDriverRules: {
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
      dialogIdcertVisible : false
      /* 修改角色相关 E */
    }
  },
  computed:{
    adminPassword(){
      return this.$store.state.user.adminPassword
    }
  },
  watch:{

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if(this.listQuery.isIdcardCert == 0){
        this.listQuery.idcardCertState = undefined
      }
      getItcDriverList(this.listQuery).then(response => {
        let data = adapt(response.data)
        this.list = data.data
        this.totalCount = data.totalCount
        this.listLoading = false
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
      this.oldTemp = cloneJSON(row)
      this.temp = cloneJSON(row)
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
      this.$refs.createItcDriver.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = cloneJSON(this.temp)
          createForm.adminPassword = this.adminPassword

          this.cancel();
          console.log(createForm)
          createItcDriver(createForm).then(() => {
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
      this.$refs.createItcDriver.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = cloneJSON(this.temp)
          var oldForm = cloneJSON(this.oldTemp)
          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            this.$notify({ title: '取消', message: '更新数据无变化', type: 'warning', duration: 2000 })
            return;
          }
          updateForm.adminPassword = this.adminPassword
          this.cancel();
          console.log(updateForm)
          updateItcDriver(updateForm).then(() => {
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
      this.temp = cloneJSON(defaultTemp)
      this.$store.commit('SET_ADMINPASSWORD', "")
    },
    /* 修改用户状态相关 S  */
    handleModifyStatus(row) {
      this.resetTemp()
      this.oldTemp = cloneJSON(row)
      this.temp = cloneJSON(row)
      this.dialogModifyStatusVisible = true
    },
    cancelModifyStatus() {
      this.resetTemp();
      this.dialogModifyStatusVisible = false;
    },
    updateModifyStatus() {
      var updateForm = cloneJSON({
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
      updateItcDriverStatus(updateForm).then(() => {
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
    /* 修改用户状态相关 E  */
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
          var updateForm = cloneJSON(this.changePasswordTemp)
          updateForm.adminPassword = this.adminPassword
          this.cancelChangePassword();
          console.log(updateForm)
          updateItcDriverPass(updateForm).then(() => {
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

    /* 实名认证信息相关 共用 dialogStatus S */
    resetIdcertTemp(){
      this.idcertTemp = cloneJSON(defaultIdcardCertTemp)
    },
    validataIdcertTemp(){
      var idcertTemp = this.idcertTemp
      if(!validateRequired(idcertTemp.user_id)){
        this.$message({ message: '用户ID未写入, 请联系管理员修复', type: 'error' })
        return false
      }else if(!validateRequired(idcertTemp.realname)){
        this.$message({ message: '请输入用户真实姓名', type: 'error' })
        return false
      }else if(!validateRequired(idcertTemp.idNum)){
        this.$message({ message: '请输入用户身份证号', type: 'error' })
        return false
      }else if(!validateRequired(idcertTemp.faceImg)){
        this.$message({ message: '请上传用户身份证正面照', type: 'error' })
        return false
      }else if(!validateRequired(idcertTemp.backImg)){
        this.$message({ message: '请上传用户身份证背面照', type: 'error' })
        return false
      }
      return true
    },
    handleIdcardcert(row){
      if(row.is_idcard_cert === 0){
        this.handleCreateIdcert(row)
      }else if(row.is_idcard_cert === 1){
        this.handleUpdateIdcert(row)
      }
    },
    handleCreateIdcert(row) {
      this.resetIdcertTemp()
      this.idcertTemp.user_id = row.user_id
      this.dialogStatus = 'create'
      this.dialogIdcertVisible = true
    },
    handleUpdateIdcert(row) {
      this.resetIdcertTemp()
      getItcIdcertInfo({user_id: row.user_id})
      .then(response => {
        let data = response.data.data
        data.user_id = row.user_id;
        this.oldIdcertTemp = cloneJSON(data)
        this.idcertTemp = cloneJSON(data)
        this.dialogStatus = 'update'
        this.dialogIdcertVisible = true
      })
    },
    enterIdcert(){
      if(this.dialogStatus=='create'){
        this.createIdcert()
      }else{
        this.updateIdcert()
      }
    },
    cancelIdcert(){
      this.resetTemp(),
      this.dialogIdcertVisible = false
    },
    createIdcert(){
      if(this.validataIdcertTemp()){
        var updateForm = cloneJSON(this.idcertTemp)
        updateForm.adminPassword = this.adminPassword
        this.listLoading = true
        this.cancelIdcert();
        createItcIdcert(updateForm).then(() => {
          this.$notify({
            title: '成功',
            message: '更新实名认证信息成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.getList()
        }).catch(() => {
          this.listLoading = false
          this.getList()
        })
      }
    },
    updateIdcert(){
      if(this.validataIdcertTemp()){
        var updateForm = cloneJSON(this.idcertTemp)
        if (compareObj(this.oldIdcertTemp, updateForm)) {
          this.cancelIdcert();
          console.log('更新状态无变化!!')
          return;
        }
        updateForm.adminPassword = this.adminPassword
        this.listLoading = true
        this.cancelIdcert();
        updateItcIdcert(updateForm).then(() => {
          this.$notify({
            title: '成功',
            message: '更新实名认证信息成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.getList()
        }).catch(() => {
          this.listLoading = false
          this.getList()
        })
      }
    },
    IDFaceSuccess(res) {
      console.log(res);
      this.$message({ message: '身份证正面上传成功', type: 'success' })
    },
    IDFaceCancel() {
      this.idcertTemp.faceImg = undefined;
      this.$message({ message: '身份证正面删除成功', type: 'success' })
    },
    IDFaceError(res) {
      this.idcertTemp.faceImg = undefined;
      this.$message({ message: '身份证正面上传失败', type: 'error' })
    },
    IDBackSuccess(res) {
      this.$message({ message: '身份证背面上传成功', type: 'success' })
    },
    IDBackCancel() {
      this.idcertTemp.backImg = undefined;
      this.$message({ message: '身份证背面删除成功', type: 'success' })
    },
    IDBackError(res) {
      this.idcertTemp.backImg = undefined;
      this.$message({ message: '身份证背面上传失败', type: 'error' })
    },
    /* 实名认证信息相关 E */
    /* 实名认证状态相关 S */
    idcertChangeState(row){
      updateItcIdcertState({
        'user_id' : row.user_id,
        'idcard_cert_state': row.idcard_cert_state
      })
      .then(() => {
        this.$notify({
          title: '成功',
          message: '更新实名认证状态成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '更新实名认证状态失败',
          type: 'error',
          duration: 2000
        })
      })
    }
    /* 实名认证状态相关 E */
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
.cursor{
  cursor: pointer;
  -webkit-appearance: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
