<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="账号/手机号" v-model="listQuery.clientName">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="150" >
        <template scope="scope">
          <span>{{scope.row.roleId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="200">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述" min-width="200">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template scope="scope">
          <el-button size="small" type="danger" @click="handleDeleteRole(scope.row)"> 删除 </el-button>
          <el-button size="small" type="danger" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleRoleMenu(scope.row)">关联菜单功能点</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 创建/编辑用户信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form class="small-space" :inline="true" :model="temp" :rules="createSysRoleRules" label-position="left" label-width="80px" style='width: 650px; margin-left:50px;' ref="createSysRole">

        <el-form-item label="角色名称" class="ks-dialog-input" prop='name'>
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" class="ks-dialog-input" prop='email'>
          <el-input v-model="temp.description" style="width:401px"></el-input>
        </el-form-item>
      </el-form>
      <dialog-footer-admin slot="footer"
        @onenter = 'enterDialog'
        @oncancel= 'cancel'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 删除角色 -->
    <el-dialog title="删除角色" :visible.sync="deleteRoleVisible" @close="cancelDeleteRole">
      <h3><center>确认要删除 {{ temp.name }} 吗?</center></h3>
      <dialog-footer-admin slot="footer"
        @onenter = 'updateDeleteRole'
        @oncancel= 'cancelDeleteRole'
      >
      </dialog-footer-admin>
    </el-dialog>

    <!-- 修改角色关联菜单-->
    <el-dialog title="修改关联菜单" :visible.sync="dialogRoleMenuVisible" @close="cancelRoleMenu">
      <el-tree
        :data="menuTemp"
        ref="menuTree"
        :props="{
          children: 'children',
          label: 'label',
          isLeaf: 'isLeaf'
        }"
        node-key="id"
        highlight-current
        show-checkbox
        default-expand-all
      >
      <!-- 
      :render-content="renderContent" 
      :check-strictly="true"
      :default-checked-keys="defaultChecked" 
      -->
      </el-tree>
    <dialog-footer-admin slot="footer"
      @onenter = 'updateRoleMenu'
      @oncancel= 'cancelRoleMenu'
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
  getSysUserInfo,
  getSysRoleList,
  createSysRole,
  updateSysRole,
  deleteSysRole,
  getSysRoleMenuRight,
  updateSysRoleMenuRight
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
  deepCloneJSON,
  getRoleMenuChecked,
  transformRoleMenu
} from '@/utils/add.js'

import {
  statusTypeOptions
} from '@/config'

const defaultTemp = {
    "roleId": "",
    "name": "",
    "description": ""
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
    const validateRoleName = (rule, value, callback) => {
      if (!validateRequired(value)) {
        callback(new Error('请输入正确的角色名称'))
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
        roleId: undefined,
        clientName: undefined,
        sort: '+id'
      },
      oldTemp: '',
      temp: deepCloneJSON(defaultTemp),
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
      deleteRoleVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      createPasswordType: "password",
      tableKey: 0,
      createSysRoleRules: {
        name: [{
          required: true,
          trigger: 'blur',
          validator: validateRoleName
        }]
      },
      /* 修改角色关联菜单相关 S */
      defaultChecked: [],
      menuTemp: [],
      dialogRoleMenuVisible : false
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
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysRoleList(this.listQuery).then(response => {
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
      this.$refs.createSysRole.validate(valid => {
        if (valid) {
          this.listLoading = true
          var createForm = deepCloneJSON(this.temp)
          createForm.adminPassword = this.adminPassword

          this.cancel();
          console.log(createForm)
          createSysRole(createForm).then(() => {
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
      this.$refs.createSysRole.validate(valid => {
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
          updateForm.adminPassword = this.adminPassword
          this.cancel();
          console.log(updateForm)
          updateSysRole(updateForm).then(() => {
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
      this.menuTemp = []
      this.$store.commit('SET_ADMINPASSWORD', "")
    },
    handleDeleteRole(row) {
      this.resetTemp()
      this.oldTemp = deepCloneJSON(row)
      this.temp = deepCloneJSON(row)
      this.deleteRoleVisible = true
    },
    cancelDeleteRole() {
      this.resetTemp();
      this.deleteRoleVisible = false;
    },
    updateDeleteRole() {
      var updateForm = deepCloneJSON({
        roleId: this.temp.roleId,
        adminPassword: this.adminPassword
      })
      this.listLoading = true
      this.cancelDeleteRole();
      deleteSysRole(updateForm).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
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

    /* 修改角色关联菜单 S */
    handleRoleMenu(row){
      this.resetTemp()
      getSysRoleMenuRight({roleId: row.roleId})
      .then(response => {
        let data = response.data.data
        data = transformRoleMenu(data)
        this.defaultChecked = getRoleMenuChecked(data)
        console.log(data)
        console.log(this.defaultChecked)
        this.menuTemp = data;
        this.dialogRoleMenuVisible = true
        this.$nextTick(()=>{
          this.$refs.menuTree.setCheckedKeys(this.defaultChecked)
        })
      })
      
      
    },
    cancelRoleMenu(){
      this.resetTemp(),
      this.dialogRoleMenuVisible = false
    },
    updateRoleMenu(){
      var currentCheckd = this.$refs.menuTree.getCheckedKeys()
      console.log(currentCheckd)
      if (compareObj(deepCloneJSON(this.defaultChecked), currentCheckd)) {
        this.cancelRoleMenu();
        console.log('更新状态无变化!!')
        return;
      }
      return
      var updateForm = deepCloneJSON({
        user_id: this.temp.user_id,
        roleId: this.temp.roleId,
        adminPassword: this.adminPassword
      })

      this.listLoading = true
      this.cancelRoleMenu();
      updateSysRoleMenuRight(updateForm).then(() => {
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
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <span style="font-size: 12px;" type="text">{ data.code }</span>
          </span>
        </span>
      );
    }
    /* 修改角色关联菜单 E */
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
.el-tree-node__content{
  display: flex;
  align-items: center;
}
</style>
