<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="平台名称" v-model="listQuery.cname">
      </el-input>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>

    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" min-width="100px" label="平台名称">
        <template scope="scope">
          <span>{{scope.row.cname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台号" width="100">
        <template scope="scope">
          <span>{{scope.row.pid}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台标签" width="100">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="描述">
        <template scope="scope">
          <span >{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.creat_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status | statusFilter(scope.row.status)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <!--v-if="scope.row.status !=='deleted'" -->
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 创建/编辑平台信息-->
    <el-form class="small-space" :inline="true" :model="temp"  :rules="createPlatformRules" label-position="left" label-width="80px" style='width: 650px; margin-left:50px;' ref="createPlatform">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel"  >

          <el-form-item label="平台名称" class="ks-dialog-input" prop='cname'>
            <el-input v-model="temp.cname"></el-input>
          </el-form-item>
          
          <el-form-item label="平台号" class="ks-dialog-input" prop='pid'>
            <el-input v-if="dialogStatus=='create'" v-model="temp.pid" ></el-input>
            <el-input v-else v-model="temp.pid" readonly :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="平台标签" class="ks-dialog-input" style="display: block" prop='name'>
            <el-input v-model="temp.name"></el-input>
          </el-form-item>

          <el-form-item label="平台描述" class="ks-dialog-input"  prop='description'>
            <el-input v-model="temp.description" style="width: 501px"></el-input>
          </el-form-item>

          <div slot="footer" class="dialog-footer">
            <el-form-item prop='adminPassword'>
              <el-input style="width: 200px;"  placeholder="管理员密码" type="password" v-model="temp.adminPassword">
              </el-input>
            </el-form-item>
            <el-button @click="cancel">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
            <el-button v-else type="primary" @click="update">确 定</el-button>
          </div>
        
      </el-dialog>
    </el-form>

    <!-- 创建/编辑平台状态-->
    <el-form class="small-space" :model="temp" :rules="modifyStatusPlatformRules"  ref="modifyStatusPlatform" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
      <el-dialog title="修改平台状态" :visible.sync="dialogModifyStatusVisible" @close="cancelModifyStatus">
          <h3 color="red">温馨提示: 请慎重操作平台</h3>
          <el-form-item label="状态" class="ks-dialog-input" prop='status'>
            <el-select class="filter-item" v-model="temp.status" placeholder="请选择" style="width: 179px">
              <el-option v-for="item in  statusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> 
        <div slot="footer" class="dialog-footer">
          <el-form-item prop='adminPassword' style="display: inline-block">
            <el-input style="width: 200px;"  placeholder="管理员密码" type="password" v-model="temp.adminPassword">
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
import { fetchPlatformList, createPlatform, updatePlatform, modifyStatusPlatform } from '@/api/platform.js'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'
import { validateRequired, validatePassword } from '@/utils/validate'

const statusTypeOptions = [
  {'key': 'normal','display_name':'正常'},
  {'key': 'freeze','display_name':'冻结'}
]
// arr to obj
const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

function adapt(data){
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
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        cname: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        cname: '',
        pid: undefined,
        name: '',
        description: '',
        creat_time: 0,
        update_time: 0,
        status: 'normal',
        adminPassword: ''
      },
      statusTypeOptions,
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      dialogModifyStatusVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      pvData: [],
      showRealnameAuth: true,
      showCarAuth: true,
      tableKey: 0,
      createPlatformRules:{
        cname: [{ required: true, trigger: 'blur', validator: validateCname }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        pid: [{ required: true, trigger: 'blur', validator: validatePid }],
        adminPassword: [{ required: true, trigger: 'blur', validator: validateAdminPassword }]
      },
      modifyStatusPlatformRules:{
        adminPassword: [{ required: true, trigger: 'blur', validator: validateAdminPassword }]
      }
    }
  },
  filters: {
    statusFilter(status) {
      return statusTypeKeyValue[status]
    },
    typeFilter(type) {
      return roleTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPlatformList(this.listQuery).then(response => {
        this.list = adapt(response.data.items)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
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
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp.adminPassword = ''
    },
    create() {
      this.$refs.createPlatform.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = Object.assign({},{
            cname: this.temp.cname,
            name: this.temp.name,
            pid: this.temp.pid,
            adminPassword: this.temp.adminPassword
          })
          this.cancel();
          createPlatform(createForm).then(() => {
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
      this.$refs.createPlatform.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = Object.assign({},{
            cname: this.temp.cname,
            name: this.temp.name,
            adminPassword: this.temp.adminPassword
          })
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
    cancel(){
      this.resetTemp()
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        cname: '',
        pid: undefined,
        name: '',
        description: '',
        creat_time: 0,
        update_time: 0,
        status: 'normal',
        adminPassword: ''
      }
    },
    handleModifyStatus(row){
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.dialogModifyStatusVisible = true
    },
    cancelModifyStatus(){
      this.resetTemp();
      this.dialogModifyStatusVisible = false;
    },
    updateModifyStatus(){
      this.$refs.modifyStatusPlatform.validate(valid => {
        if (valid) {
          this.listLoading = true
          var updateForm = Object.assign({},{
            status: this.temp.status,
            adminPassword: this.temp.adminPassword
          })
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
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
  div.ks-dialog-input:nth-child(2n+1){
    margin-right: 60px !important;
  }
</style>