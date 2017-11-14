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
      <el-table-column align="center" label="授权账号代码" width="150">
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
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">关联接口</el-button>
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 创建/编辑授权帐号信息  :rules="createAuthAccountRules"  -->
    <el-form class="small-space" :inline="true" :model="temp" label-position="left" label-width="140px" style='width: 850px; margin-left:50px;' ref="createAuthAccount">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel" custom-class="ks-big_dialog">
        <el-form-item label="平台号" class="ks-dialog-input" prop='parentId'>
          <el-select class="filter-item" v-model="temp.parentId" placeholder="请选择" style="width: 179px">
            <el-option v-if="platformAll" v-for="platform in platformAll" :key="platform.clientName" :label="platform.clientName" :value="platform.clientCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权类型" class="ks-dialog-input" prop='clientType'>
          <el-select class="filter-item" v-model="temp.clientType" placeholder="请选择" style="width: 179px">
            <el-option v-if="clientTypeOptions" v-for="item in clientTypeOptions" :key="item.key" :value="item.display_name" :label="item.display_name">
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
          <el-input v-model="temp.clientPassword"></el-input>
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
          <el-input v-model="temp.smsPassword"></el-input>
        </el-form-item>
        <el-form-item label="短信发送地址" class="ks-dialog-input" prop='smsUrl'>
          <el-input v-model="temp.smsUrl"></el-input>
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
    <!-- 创建/编辑平台状态-->
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

export default {
  name: 'table_demo',
  directives: {
    waves
  },
  data() {
    const validateCname = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的平台名称'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (!/^\w+$/.test(value)) {
        callback(new Error('请输入正确的平台标签(英文或数字)'))
      } else {
        callback()
      }
    }
    const validatePid = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error('请输入正确的平台号码(纯数字)'))
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
      list: null,
      totalCount: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        clientName: undefined,
        sort: '+id'
      },
      oldTemp: '',
      temp: {
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
        "accessTokenExpires": '',
        "refreshTokenExpires": '',
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
      },
      statusTypeOptions,
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
        "clientCode": 0,
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
        clientName: [{
          required: true,
          trigger: 'blur',
          validator: validateCname
        }],
        clientTag: [{
          required: true,
          trigger: 'blur',
          validator: validateName
        }],
        clientCode: [{
          required: true,
          trigger: 'blur',
          validator: validatePid
        }],
        adminPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateAdminPassword
        }]
      },
      clientTypeOptions
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
            let data = Object.assign({}, response.data)
            this.temp = Object.assign({}, data)
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
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined
        this.listQuery.end = undefined
        return
      }
      this.listQuery.start = parseInt(+time[0] / 1000)
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.adminPassword = ''
    },
    handleUpdate(row) {
      this.resetTemp()
      this.oldTemp = Object.assign({}, row)
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp.adminPassword = ''
      })
    },
    create() {
      this.$refs.createAuthAccount.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = Object.assign({}, {
            clientName: this.temp.clientName,
            clientTag: this.temp.clientTag,
            clientCode: this.temp.clientCode,
            description: this.oldTemp.description,
            adminPassword: this.temp.adminPassword
          })
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
          console.log('error submit!!')
          return false
        }
      })
    },
    update() {
      this.$refs.createAuthAccount.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = Object.assign({}, {
            clientName: this.temp.clientName,
            clientTag: this.temp.clientTag,
            description: this.temp.description,
            adminPassword: this.temp.adminPassword
          })
          var oldForm = Object.assign({}, {
            clientName: this.oldTemp.clientName,
            clientTag: this.oldTemp.clientTag,
            description: this.oldTemp.description,
            adminPassword: this.temp.adminPassword
          })

          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            console.log('更新数据无变化!!')
            return;
          }
          this.cancel();
          updatePlatform(updateForm).then(() => {
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
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.resetTemp()
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
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
        "accessTokenExpires": '',
        "refreshTokenExpires": '',
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
    },
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
        modifyStatusPlatform(updateForm).then(() => {
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
    }
  }
}
</script>
<style>
div.ks-dialog-input:nth-child(2n+1) {
  margin-right: 60px !important;
}
.ks-big_dialog{
  width: 850px !important;
}
</style>
