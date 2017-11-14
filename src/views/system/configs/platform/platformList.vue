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

      <el-table-column align="center" min-width="100px" label="平台名称">
        <template scope="scope">
          <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台号" width="100">
        <template scope="scope">
          <span>{{scope.row.clientCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台标签" width="100">
        <template scope="scope">
          <span>{{scope.row.clientTag}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="描述">
        <template scope="scope">
          <span >{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="状态">
        <template scope="scope">
          <el-tag :type="scope.row.clientState | statusTagFilter">{{scope.row.clientState | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleModifyStatus(scope.row)"> 禁用 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 创建/编辑平台信息-->
    <el-form class="small-space" :inline="true" :model="temp"  :rules="createPlatformRules" label-position="left" label-width="80px" style='width: 650px; margin-left:50px;' ref="createPlatform">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel"  >

          <el-form-item label="平台名称" class="ks-dialog-input" prop='clientName'>
            <el-input v-model="temp.clientName"></el-input>
          </el-form-item>
          
          <el-form-item label="平台号" class="ks-dialog-input" prop='clientCode'>
            <el-input v-if="dialogStatus=='create'" v-model="temp.clientCode" ></el-input>
            <el-input v-else v-model="temp.clientCode" readonly :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="平台标签" class="ks-dialog-input" style="display: block" prop='clientTag'>
            <el-input v-model="temp.clientTag"></el-input>
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
import { Message } from 'element-ui'
import { getPlatformList, createPlatform, updatePlatform, modifyStatusPlatform } from '@/api/platform.js'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'
import { validateRequired, validatePassword } from '@/utils/validate'
import { compareObj } from '@/utils/add.js'

const statusTypeOptions = [
  {'key': 1,'display_name':'正常', 'tag' : 'success'},
  {'key': 0,'display_name':'已禁用', 'tag' : 'danger'}
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
        id: undefined,
        clientName: '',
        clientCode: undefined,
        clientTag: '',
        description: '',
        createTime: 0,
        updateTime: 0,
        clientState: 1,
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
        clientName: [{ required: true, trigger: 'blur', validator: validateCname }],
        clientTag: [{ required: true, trigger: 'blur', validator: validateName }],
        clientCode: [{ required: true, trigger: 'blur', validator: validatePid }],
        adminPassword: [{ required: true, trigger: 'blur', validator: validateAdminPassword }]
      }
    }
  },
  filters: {
    statusFilter(clientState) {
      return statusTypeKeyValue[clientState]
    },
    statusTagFilter(status) {
      for(var i=0; i< statusTypeOptions.length; i++){
        if(statusTypeOptions[i].key == status){
          return statusTypeOptions[i].tag 
        }
      }
      return ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPlatformList(this.listQuery).then(response => {
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
      this.$nextTick(()=>{
        this.temp.adminPassword = ''
      })
    },
    create() {
      this.$refs.createPlatform.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = Object.assign({},{
            clientName: this.temp.clientName,
            clientTag: this.temp.clientTag,
            clientCode: this.temp.clientCode,
            description: this.oldTemp.description,
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
            clientName: this.temp.clientName,
            clientTag: this.temp.clientTag,
            description: this.temp.description,
            adminPassword: this.temp.adminPassword
          })
          var oldForm = Object.assign({},{
            clientName: this.oldTemp.clientName,
            clientTag: this.oldTemp.clientTag,
            description: this.oldTemp.description,
            adminPassword: this.temp.adminPassword
          })

          if(compareObj(oldForm,updateForm)){
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
    cancel(){
      this.resetTemp()
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        clientName: '',
        clientCode: undefined,
        clientTag: '',
        description: '',
        createTime: 0,
        updateTime: 0,
        clientState: 1,
        adminPassword: ''
      }
    },
    handleModifyStatus(row){
      this.resetTemp()
      this.oldTemp = Object.assign({}, row)
      this.temp = Object.assign({}, row)
      this.dialogModifyStatusVisible = true
    },
    cancelModifyStatus(){
      this.resetTemp();
      this.dialogModifyStatusVisible = false;
    },
    updateModifyStatus(){
      if(validatePassword(this.temp.adminPassword)){
        this.listLoading = true
        var updateForm = Object.assign({},{
          clientState: this.temp.clientState,
          adminPassword: this.temp.adminPassword
        })
        if(compareObj(this.oldTemp.clientState, this.temp.clientState)){
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
  div.ks-dialog-input:nth-child(2n+1){
    margin-right: 60px !important;
  }
</style>