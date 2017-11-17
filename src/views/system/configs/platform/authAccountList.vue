<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="帐号名称" v-model="listQuery.clientName">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="100">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="帐号标签" width="100">
        <template scope="scope">
          <span>{{scope.row.clientTag}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="授权账号名称">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="令牌失效时间(秒)">
        <template scope="scope">
          <span>{{scope.row.accessTokenExpires}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label=" 令牌刷新时间(秒)">
        <template scope="scope">
          <span>{{scope.row.refreshTokenExpires}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="状态">
        <template scope="scope">
          <el-tag :type="scope.row.clientState | statusTagFilter">{{scope.row.clientState | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleUpdateResource(scope.row)">关联接口</el-button>
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 创建/编辑授权帐号信息   -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel" custom-class="ks-big_dialog">
      <el-form class="small-space" :inline="true" :model="temp" :rules="createAuthAccountRules" label-position="left" label-width="140px" style='width: 850px; margin-left:50px;' ref="createAuthAccount">
        <el-form-item label="所属平台号" class="ks-dialog-input" prop='parentId'>
          <el-select class="filter-item" v-model="temp.parentId" placeholder="请选择" style="width: 179px">
            <el-option v-if="platformAll" v-for="platform in platformAll" :key="platform.clientName" :label="platform.clientName" :value="platform.clientCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权类型" class="ks-dialog-input" prop='clientType'>
          <el-select class="filter-item" v-model="temp.clientType" placeholder="请选择" style="width: 179px">
            <el-option v-for="item in clientTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号名称" class="ks-dialog-input" prop='clientName'>
          <el-input v-model="temp.clientName"></el-input>
        </el-form-item>
        <el-form-item label="账号标签" class="ks-dialog-input" prop='clientTag'>
          <el-input v-model="temp.clientTag"></el-input>
        </el-form-item>
        <el-form-item label="授权账号" class="ks-dialog-input" prop='clientId'>
          <el-input v-model="temp.clientId"></el-input>
        </el-form-item>
        <el-form-item label="授权密码" class="ks-dialog-input" prop='clientPassword'>
          <el-input :type="clientPasswordType" v-model="temp.clientPassword" autoComplete="off" placeholder="密码" />
          <span class='show-pwd' @click='showClientPassword'><icon-svg icon-class="eye" /></icon-svg></span>
        </el-form-item>
        <el-form-item label="令牌失效时间(秒)" class="ks-dialog-input" prop='accessTokenExpires'>
          <el-input v-model="temp.accessTokenExpires"></el-input>
        </el-form-item>
        <el-form-item label="令牌刷新时间(秒)" class="ks-dialog-input" prop='refreshTokenExpires'>
          <el-input v-model="temp.refreshTokenExpires"></el-input>
        </el-form-item>
        <el-form-item label="微信APPID" class="ks-dialog-input" prop='wxAppId'>
          <el-input v-model="temp.wxAppId"></el-input>
        </el-form-item>
        <el-form-item label="微信APPSECURT" class="ks-dialog-input" prop='wxAppSecurt'>
          <el-input v-model="temp.wxAppSecurt"></el-input>
        </el-form-item>
        <el-form-item label="短信用户名" class="ks-dialog-input" prop='smsUsername'>
          <el-input v-model="temp.smsUsername"></el-input>
        </el-form-item>
        <el-form-item label="短信用户密码" class="ks-dialog-input" prop='smsPassword'>
          <el-input :type="smsPasswordType" v-model="temp.smsPassword" autoComplete="off" placeholder="密码" />
          <span class='show-pwd' @click='showSmsPasswordType'><icon-svg icon-class="eye" /></icon-svg></span>
        </el-form-item>
        <el-form-item label="短信发送地址" class="ks-dialog-input" prop='smsUrl'>
          <el-input v-model="temp.smsUrl" style="width: 501px"></el-input>
        </el-form-item>
        <el-form-item label="帐号描述" class="ks-dialog-input" prop='description'>
          <el-input v-model="temp.description" style="width: 501px"></el-input>
        </el-form-item>
        <el-form-item label="IP白名单" prop='clientIps'>
          <el-input style="width: 501px;display:block" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" v-model="temp.clientIps">
          </el-input>
        </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'enterDialog'
        @oncancel= 'cancel'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 创建/编辑帐号状态-->
    <el-dialog title="修改帐号启用状态" :visible.sync="dialogModifyStatusVisible" @close="cancelModifyStatus">
      <el-form class="small-space" :model="temp" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
        <h3 color="red">温馨提示: 请慎重修改启用状态</h3>
        <el-form-item label="状态" class="ks-dialog-input" prop='clientState'>
          <el-select class="filter-item" v-model="temp.clientState" placeholder="请选择" style="width: 179px">
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

    <!-- 编辑关联接口-->
    <el-dialog title="修改关联接口" :visible.sync="dialogResourceVisible" @close="cancelResource">
      <el-form class="small-space" :model="resourceTemp" label-position="left" label-width="120px" style='width: 850px; margin-left:50px;'>
        <el-form-item v-for="item in resourceTemp.list" :key="item.service" :label="item.serviceName + ':'">
          <el-checkbox-group v-for="checkItem in item.list" v-model="checkItem.checkbox" :key="checkItem.path">
            <el-checkbox :label="checkItem.path+' ('+checkItem.name+')'" :name="checkItem.service" value="true" :checked="checkItem.checkbox"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'updateResource'
        @oncancel= 'cancelResource'
      >
      </dialog-footer-admin>
    </el-dialog>

  </div>
</template>
<script>
import {
  Message
} from 'element-ui'
import {
  getAuthAccountList,
  getAuthAccountInfo,
  getAuthAccountResource,
  getPlatformAll,
  createAuthAccount,
  updateResource,
  updateAuthAccountResource,
  modifyStatusAuthAccount
} from '@/api/platform.js'
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
} from '@/utils/add.js'
import {
  clientTypeOptions,
  statusTypeOptions
} from '@/config'


function adapt(data) {
  return data;
}

const defaultTemp = {
  "id": '',
  "parentId": '',
  "clientType": '',
  "clientCode": '',
  "clientParentCode": '',
  "clientState": '',
  "clientTag": "",
  "clientName": "",
  "description": "",
  "clientId": "",
  "clientPassword": "",
  "accessTokenExpires": 7200, //7200
  "refreshTokenExpires": 2592000, //2592000
  "clientIps": null,
  "wxAppId": null,
  "wxAppSecurt": null,
  "smsUsername": "",
  "smsPassword": "",
  "smsUrl": "",
  "outletType": null,
  "createTime": "",
  "updateTime": ""
}
const defaultResourceTemp = {
  "clientCode": '',
  "list": []
}
export default {
  name: 'table_demo',
  directives: {
    waves
  },
  data() {
    const validateParentId = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请选择所属平台'))
      } else {
        callback()
      }
    }
    const validateClientType = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请选择授权类型'))
      } else {
        callback()
      }
    }
    const validateClientName = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的帐号名称'))
      } else {
        callback()
      }
    }
    const validateClientTag = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的帐号标签'))
      } else {
        callback()
      }
    }
    const validateClientId = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的授权帐号'))
      } else {
        callback()
      }
    }
    const validateClientPassword = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的授权密码'))
      } else {
        callback()
      }
    }

    return {
      statusTypeOptions,
      clientTypeOptions,
      list: null,
      totalCount: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        clientName: '',
        sort: '+id'
      },
      temp: deepCloneJSON(defaultTemp),
      oldTemp: '',
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
      platformAll: [{
        "parentId": 0,
        "clientType": 0,
        "clientCode": 0,
        "clientParentCode": 0,
        "clientState": 1,
        "clientTag": "test",
        "clientName": "测试平台",
        "description": "主要用于后台管理系统"
      }],
      showRealnameAuth: true,
      showCarAuth: true,
      tableKey: 0,
      createAuthAccountRules: {
        parentId: [{
          required: true,
          trigger: 'change',
          validator: validateParentId
        }],
        clientType: [{
          required: true,
          trigger: 'change',
          validator: validateClientType
        }],
        clientName: [{
          required: true,
          trigger: 'blur',
          validator: validateClientName
        }],
        clientTag: [{
          required: true,
          trigger: 'blur',
          validator: validateClientTag
        }],
        clientId: [{
          required: true,
          trigger: 'blur',
          validator: validateClientId
        }],
        clientPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateClientPassword
        }]
      },
      clientPasswordType: 'password',
      smsPasswordType: 'password',
      // 关联接口相关
      resourceClientCode: '',
      oldResourceTemp: '',
      resourceTemp: deepCloneJSON(defaultResourceTemp),
      dialogResourceVisible: false
    }
  },  
  computed:{
    adminPassword(){
      return this.$store.state.user.adminPassword
    }
  },
  created() {
    this.getList()
    this.getPlatformAll()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAuthAccountList(this.listQuery).then(response => {
        let data = adapt(response.data)
        this.list = data.data
        this.totalCount = data.totalCount
        this.listLoading = false
      })
    },
    getPlatformAll() {
      let parentId = 0;
      getPlatformAll(parentId)
        .then(response => {
          this.platformAll = response.data.data
        })
        .catch(e => {
          Message({
            message: '获取平台信息总数失败',
            type: 'error',
            duration: 2 * 1000
          })
        })
    },
    getAuthAccountInfo(row) {
      return new Promise((resolve, reject) => {
        let clientCode = row.clientCode
        getAuthAccountInfo(clientCode)
          .then(response => {
            let data = response.data.data
            resolve(data);
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    getAuthAccountResource(row) {
      return new Promise((resolve, reject) => {
        let clientCode = row.clientCode
        getAuthAccountResource(clientCode)
          .then(response => {
            let data = response.data.data
            resolve(data);
          })
          .catch(e => {
            reject(e)
          })
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
    // 创建/更新帐号
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      this.getAuthAccountInfo(row)
        .then(data => {
          this.oldTemp = deepCloneJSON(data)
          this.temp = deepCloneJSON(data)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
    },
    enterDialog(){
      if(this.dialogStatus=='create'){
        this.create()
      }else{
        this.update()
      }
    },
    create() {
      this.$refs.createAuthAccount.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = deepCloneJSON(this.temp)
          console.log(createForm)
          this.cancel();
          createAuthAccount(createForm).then(() => {
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
          console.error('error submit!!')
          return false
        }
      })
    },
    update() {
      this.$refs.createAuthAccount.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = deepCloneJSON(this.temp)
          var oldForm = deepCloneJSON(this.oldTemp)
          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            console.log('更新数据无变化!!')
            return;
          }
          this.cancel();
          updateForm.adminPassword = this.adminPassword
          console.log(updateForm)
          updateAuthAccountResource(updateForm).then(() => {
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
          console.error('error submit!!')
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
    // 更改状态
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
      this.listLoading = true
      var updateForm = deepCloneJSON({
        clientState: this.temp.clientState,
        adminPassword: this.adminPassword
      })
      if (compareObj(this.oldTemp.clientState, this.temp.clientState)) {
        this.cancelModifyStatus();
        this.listLoading = false
        console.log('更新状态无变化!!')
        return;
      }
      this.cancelModifyStatus();
      modifyStatusAuthAccount(updateForm).then(() => {
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
    showClientPassword() {
      this.clientPasswordType = this.clientPasswordType === 'password' ? 'text' : 'password'
    },
    showSmsPasswordType() {
      this.smsPasswordType = this.smsPasswordType === 'password' ? 'text' : 'password'
    },

    // 关联接口相关
    resetResourceTemp() {
      this.resourceTemp = deepCloneJSON(defaultResourceTemp)
      this.$store.commit('SET_ADMINPASSWORD', "")
    },
    cancelResource() {
      this.resetResourceTemp()
      this.dialogResourceVisible = false;
    },
    handleUpdateResource(row) {
      this.resetResourceTemp()
      this.resourceClientCode = row.clientCode
      this.getAuthAccountResource(row)
        .then(data => {
          console.log(data)
          let resourceForm = {
            "clientCode": row.clientCode,
            "list": data
          }
          this.oldResourceTemp = deepCloneJSON(resourceForm)
          this.resourceTemp = deepCloneJSON(resourceForm)
          this.dialogResourceVisible = true
        })
    },
    transformResourceForm() {
      let list = JSON.stringify(this.resourceTemp.list)
      console.log(list)
      var updateForm = {
        data: list,
        adminPassword: this.adminPassword,
        clientCode: this.resourceTemp.resourceClientCode
      }
      return updateForm
    },
    updateResource() {
      if (compareObj(this.oldResourceTemp.list, this.resourceTemp.list)) {
        this.cancelResource();
        this.listLoading = false
        console.log('更新状态无变化!!')
        return;
      }
      this.listLoading = true
      var updateForm = this.transformResourceForm()
      this.cancelResource();
      updateResource(updateForm)
      .then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
        this.getList()
      })
      .catch(() => {
        this.listLoading = false
        this.getList()
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
div.ks-dialog-input:nth-child(2n+1) {
  margin-right: 60px !important;
}

.ks-big_dialog {
  width: 850px !important;
}

.ks-lg_dialog {
  width: 1000px !important;
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
