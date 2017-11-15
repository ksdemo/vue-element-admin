<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="平台名称" v-model="listQuery.clientName">
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
          <el-tag :type="scope.row.clientState | statusTagFilter">{{scope.row.clientState | statusFilter }}</el-tag>
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
    <el-form class="small-space" :inline="true" :model="temp" :rules="createAuthAccountRules" label-position="left" label-width="140px" style='width: 850px; margin-left:50px;' ref="createAuthAccount">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel" custom-class="ks-big_dialog">
        <el-form-item label="平台号" class="ks-dialog-input" prop='parentId'>
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
            <el-input :type="clientPasswordType"  v-model="temp.clientPassword" autoComplete="off"
            placeholder="密码" />
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
            <el-input :type="smsPasswordType"  v-model="temp.smsPassword" autoComplete="off"
            placeholder="密码" />
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
        <div slot="footer" class="dialog-footer">
          <el-form-item prop='adminPassword'>
            <el-input style="width: 200px;" placeholder="管理员密码" type="password" v-model="temp.adminPassword">
            </el-input>
          </el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
          <el-button v-else type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
    <!-- 创建/编辑帐号状态-->
    <el-form class="small-space" :model="temp" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
      <el-dialog title="修改平台状态" :visible.sync="dialogModifyStatusVisible" @close="cancelModifyStatus">
        <h3 color="red">温馨提示: 请慎重操作平台</h3>
        <el-form-item label="状态" class="ks-dialog-input" prop='clientState'>
          <el-select class="filter-item" v-model="temp.clientState" placeholder="请选择" style="width: 179px">
            <el-option v-for="item in  statusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-form-item prop='adminPassword' style="display: inline-block">
            <el-input style="width: 200px;" placeholder="管理员密码" type="password" v-model="temp.adminPassword">
            </el-input>
          </el-form-item>
          <el-button @click="cancelModifyStatus">取 消</el-button>
          <el-button @click="updateModifyStatus">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>

    <!-- 编辑关联接口-->
    <el-dialog title="修改关联接口" custom-class="ks-big_dialog" :visible.sync="dialogResourceVisible" @close="cancelResource">
      <el-form class="small-space" :model="resourceTemp" label-position="left" label-width="80px" style='width: 850px; margin-left:50px;'>
        
        <div slot="footer" class="dialog-footer">
          <el-form-item prop='adminPassword' style="display: inline-block">
            <el-input style="width: 200px;" placeholder="管理员密码" type="password" v-model="resourceTemp.adminPassword">
            </el-input>
          </el-form-item>
          <el-button @click="cancelResource">取 消</el-button>
          <el-button @click="updateResource">确 定</el-button>
        </div>
      </el-form>
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
  getPlatformAll,
  createAuthAccount,
  updateAuthAccount,
  modifyStatusAuthAccount,
  getResource,
  updateResource
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
  compareObj
} from '@/utils/add.js'
import {
  clientTypeOptions,
  statusTypeOptions
} from '@/config/index.js'

// arr to obj
const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
      "accessTokenExpires": 7200,//7200
      "refreshTokenExpires": 2592000,//2592000
      "clientIps": null,
      "wxAppId": null,
      "wxAppSecurt": null,
      "smsUsername": "",
      "smsPassword": "",
      "smsUrl": "",
      "outletType": null,
      "createTime": "",
      "updateTime": "",
      "adminPassword": ''
    }
const defaultResourceTemp = {
  "adminPassword": '',
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
    const validateAdminPassword = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('请输入正确的管理员密码'))
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
      temp: Object.assign({},defaultTemp),
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
        }],
        adminPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateAdminPassword
        }]
      },
      clientPasswordType: 'password',
      smsPasswordType: 'password',
      // 关联接口相关
      resourceClientCode: '',
      oldResourceTemp:'',
      resourceTemp: Object.assign({},defaultResourceTemp),
      dialogResourceVisible: false
    }
  },
  filters: {
    statusFilter(clientState) {
      return statusTypeKeyValue[clientState]
    },
    statusTagFilter(status) {
      for (var i = 0; i < statusTypeOptions.length; i++) {
        if (statusTypeOptions[i].key == status) {
          return statusTypeOptions[i].tag
        }
      }
      return ''
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
            let data = Object.assign({}, response.data.data)
            resolve(data);
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    getResource(row) {
      return new Promise((resolve, reject) => {
        let clientCode = row.clientCode
        getResource(clientCode)
          .then(response => {
            let data = Object.assign({}, response.data.data)
            this.resourcTemp = Object.assign({}, data)
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
      this.temp.adminPassword = ''
    },
    handleUpdate(row) {
      this.resetTemp()
      this.getAuthAccountInfo(row)
      .then(data=>{
        this.oldTemp = Object.assign({}, data)
        this.temp = Object.assign({}, data)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      })
    },
    create() {
      this.$refs.createAuthAccount.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = Object.assign({}, this.temp)
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
          var updateForm = Object.assign({}, this.temp)
          var oldForm = Object.assign({}, this.oldTemp)
          oldForm.adminPassword = this.temp.adminPassword
          console.log(updateForm)
          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            console.log('更新数据无变化!!')
            return;
          }
          this.cancel();
          updateAuthAccount(updateForm).then(() => {
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
      this.temp = Object.assign({},defaultTemp)
    },
    // 更改状态
    handleModifyStatus(row) {
      this.resetTemp()
      this.oldTemp = Object.assign({}, row)
      this.temp = Object.assign({}, row)
      this.dialogModifyStatusVisible = true
    },
    cancelModifyStatus() {
      this.resetTemp();
      this.dialogModifyStatusVisible = false;
    },
    updateModifyStatus() {
      if (validatePassword(this.temp.adminPassword)) {
        this.listLoading = true
        var updateForm = Object.assign({}, {
          clientState: this.temp.clientState,
          adminPassword: this.temp.adminPassword
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
      } else {
        Message({
          message: '请输入管理员密码',
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }
    },
    showClientPassword(){
      this.clientPasswordType = this.clientPasswordType === 'password' ? 'text' : 'password'
    },
    showSmsPasswordType(){
      this.smsPasswordType = this.smsPasswordType === 'password' ? 'text' : 'password'
    },

    // 关联接口相关
    resetResourceTemp() {
      this.resourceTemp = Object.assign({},defaultResourceTemp)
    },
    cancelResource() {
      this.resetResourceTemp()
      this.dialogResourceVisible = false;
    },
    handleUpdateResource(row) {
      this.resetResourceTemp()
      this.resourceClientCode = row.clientCode
      this.getResource(row)
      .then(data=>{
        console.log(data)
        let resourceForm= {
          "adminPassword": '',
          "clientCode": row.clientCode,
          "list": data
        }
        this.oldResourceTemp = Object.assign({}, resourceForm)
        this.resourceTemp = Object.assign({}, resourceForm)
        this.dialogResourceVisible = true
      })
    },
    transformResourceForm(resourceTemp){
      let list = resourceTemp.list;
      console.log(list)
      var updateForm = {
        data: list,
        adminPassword: this.resourceTemp.adminPassword,
        clientCode: this.resourceTemp.resourceClientCode
      }
      return updateForm
    },
    updateResource() {
      if (validatePassword(this.resourceTemp.adminPassword)) {
        this.listLoading = true
        if (compareObj(this.oldResourceTemp.list, this.resourceTemp.list)) {
          this.cancelResource();
          this.listLoading = false
          console.log('更新状态无变化!!')
          return;
        }
        var updateForm = transformResourceForm(this.resourceTemp)
        this.cancelResource();
        updateResource(updateForm).then(() => {
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
        Message({
          message: '请输入管理员密码',
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }
    },
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
  .ks-big_dialog{
    width: 850px !important;
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
