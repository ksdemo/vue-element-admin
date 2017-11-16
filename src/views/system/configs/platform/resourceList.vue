<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="接口名称" v-model="listQuery.clientName">
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
          <span>{{scope.row.resId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务名称" width="100">
        <template scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接口名称" min-width="150">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="URL" min-width="150">
        <template scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="状态">
        <template scope="scope">
          <el-tag :type="scope.row.resState | statusTagFilter">{{scope.row.resState | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleUpdateResourceAccount(scope.row)">关联帐号</el-button>
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 创建/编辑授权接口信息   -->
    <el-form class="small-space" :inline="true" :model="temp" label-position="left" label-width="140px" style='width: 850px; margin-left:50px;' ref="createResource" :rules="createResourceRules">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel" custom-class="ks-big_dialog">
        <el-form-item label="服务名称" class="ks-dialog-input" prop='service'>
          <el-select class="filter-item" v-model="temp.service" placeholder="请选择" style="width: 179px">
            <el-option v-if="serviceList" v-for="item in serviceList" :key="item.serviceCode" :label="item.serviceName" :value="item.serviceCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口名称" class="ks-dialog-input" prop='name'>
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" class="ks-dialog-input" prop='path'>
          <el-input v-model="temp.path" style="width: 501px"></el-input>
        </el-form-item>
        <el-form-item label="帐号描述" class="ks-dialog-input" prop='description'>
          <el-input v-model="temp.description" style="width: 501px"></el-input>
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
      <el-dialog title="修改接口启用状态" :visible.sync="dialogModifyStatusVisible" @close="cancelModifyStatus">
        <h3 color="red">温馨提示: 请慎重修改启用状态</h3>
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
    <!-- 编辑关联帐号-->
    <el-form class="small-space" :model="resourceTemp" label-position="left" label-width="200px" style='width: 850px; margin-left:50px;'>
      <el-dialog title="修改关联帐号" :visible.sync="dialogResourceVisible" @close="cancelResource">
        <el-form-item v-for="item in resourceTemp.list" :key="item.platfromName" :label="item.platfromName+':'">
          <el-checkbox-group v-for="checkItem in item.list" v-model="checkItem.checkbox" :key="checkItem.clientName">
            <el-checkbox :label="checkItem.clientName" :name="checkItem.clientName" value="true" :checked="checkItem.checkbox"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-form-item prop='adminPassword' style="display: inline-block">
            <el-input style="width: 200px;" placeholder="管理员密码" type="password" v-model="resourceTemp.adminPassword">
            </el-input>
          </el-form-item>
          <el-button @click="cancelResource">取 消</el-button>
          <el-button @click="updateResource">确 定</el-button>
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
  getResourceList,
  getResourceInfo,
  getResourceAccount,
  getServiceList,
  createResource,
  updateResource,
  updateResourceAccount,
  modifyStatusResource
} from '@/api/platform.js'
import waves from '@/directive/waves/index.js' // 水波纹指令
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
  "resId": '',
  "service": "",
  "serviceName": "",
  "pathPrefix": "",
  "resState": '',
  "path": "",
  "name": "",
  "description": "",
  "clientIds": null,
  "createUser": 1,
  "updateUser": 1,
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
    const validateService = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请选择所属服务'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的接口名称'))
      } else {
        callback()
      }
    }
    const validatePath = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的接口URL'))
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
      serviceList: [{
        "serviceId": "",
        "serviceCode": "",
        "serviceName": "",
        "pathPrefix": "",
        "serviceDesc": "",
        "createTime": "",
        "updateTime": ""
      }],
      showRealnameAuth: true,
      showCarAuth: true,
      tableKey: 0,
      createResourceRules: {
        service: [{
          required: true,
          trigger: 'change',
          validator: validateService
        }],
        name: [{
          required: true,
          trigger: 'blur',
          validator: validateName
        }],
        path: [{
          required: true,
          trigger: 'blur',
          validator: validatePath
        }],
        adminPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateAdminPassword
        }]
      },

      // 关联接口相关
      resourceClientCode: '',
      oldResourceTemp: '',
      resourceTemp: deepCloneJSON(defaultResourceTemp),
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
    this.getServiceList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getResourceList(this.listQuery).then(response => {
        let data = adapt(response.data)
        this.list = data.data
        this.totalCount = data.totalCount
        this.listLoading = false
      })
    },
    getServiceList() {
      let parentId = 0;
      getServiceList(parentId)
        .then(response => {
          this.serviceList = response.data.data
        })
        .catch(e => {
          Message({
            message: '获取服务信息列表失败',
            type: 'error',
            duration: 2 * 1000
          })
        })
    },
    getResourceInfo(row) {
      return new Promise((resolve, reject) => {
        let resId = row.resId
        getResourceInfo(resId)
          .then(response => {
            console.log(response)
            let data = response.data.data
            resolve(data);
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    getResourceAccount(row) {
      return new Promise((resolve, reject) => {
        let clientCode = row.clientCode
        getResourceAccount(clientCode)
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
      this.temp.adminPassword = ''
    },
    handleUpdate(row) {
      this.resetTemp()
      this.getResourceInfo(row)
        .then(data => {
          this.oldTemp = deepCloneJSON(data)
          this.temp = deepCloneJSON(data)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
    },
    create() {
      this.$refs.createResource.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = deepCloneJSON(this.temp)
          console.log(createForm)
          this.cancel();
          createResource(createForm).then(() => {
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
      this.$refs.createResource.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = deepCloneJSON(this.temp)
          var oldForm = deepCloneJSON(this.oldTemp)
          oldForm.adminPassword = this.temp.adminPassword
          console.log(updateForm)
          if (compareObj(oldForm, updateForm)) {
            this.cancel();
            this.listLoading = false
            console.log('更新数据无变化!!')
            return;
          }
          this.cancel();
          updateResourceAccount(updateForm).then(() => {
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
      if (validatePassword(this.temp.adminPassword)) {
        this.listLoading = true
        var updateForm = deepCloneJSON({
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
        modifyStatusResource(updateForm).then(() => {
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

    // 关联接口相关
    resetResourceTemp() {
      this.resourceTemp = deepCloneJSON(defaultResourceTemp)
    },
    cancelResource() {
      this.resetResourceTemp()
      this.dialogResourceVisible = false;
    },
    handleUpdateResourceAccount(row) {
      this.resetResourceTemp()
      this.resourceClientCode = row.clientCode
      this.getResourceAccount(row)
        .then(data => {
          console.log(data)
          let resourceForm = {
            "adminPassword": '',
            "clientCode": row.clientCode,
            "list": data
          }
          this.oldResourceTemp = deepCloneJSON(resourceForm)
          this.resourceTemp = deepCloneJSON(resourceForm)
          this.dialogResourceVisible = true
        })
    },
    updateResource() {
      function transformResourceForm(resourceTemp) {
        let list = JSON.stringify(resourceTemp.list)
        console.log(list)
        var updateForm = {
          data: list,
          adminPassword: resourceTemp.adminPassword,
          clientCode: resourceTemp.resourceClientCode
        }
        return updateForm
      }

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
