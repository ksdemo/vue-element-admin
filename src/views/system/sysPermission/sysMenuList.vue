<template>
  <div class="app-container calendar-list-container">
    <div style="font-size: 12px;margin-bottom: 10px; color: gray">提示: 点击三角形小图标才能展开菜单, 部分操作仅修改数据库,需更改对应前端路由才有显示效果</div>
    <!-- 过滤 -->
    <div class="filter-container">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
    </div>
    <!-- 树形菜单 -->
    <div 
      v-loading="listLoading" 
      element-loading-text="给我一点时间"
    >
      <el-tree
        :data="menuData"
        ref="menuTree"
        :props="{
          children: 'children',
          label: 'label',
          isLeaf: 'isLeaf'
        }"
        node-key="id"
        :filter-node-method="filterNode"
        :default-checked-keys="defaultChecked"
        :check-strictly="true"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      >
      </el-tree>
      <!-- accordion -->
    </div>
    <!-- 操作按钮 -->
    <div style="margin-top: 20px; text-align: right">
      <el-button @click="cancelChangeMenu" size="medium">取消更改</el-button>
      <el-button @click="handleChangeMenu" size="medium" type="primary">提交更改</el-button>
    </div>
    <!-- 确认弹窗 -->
    <el-dialog title="更新菜单" :visible.sync="dialogFormVisible" @close="cancelChangeMenu">
      <h3><center>提示: 确认要更新菜单吗? 部分操作仅修改数据库,需更改对应前端路由才有显示效果</center></h3>
      <dialog-footer-admin slot="footer"
        @onenter = 'updateChangeMenu'
        @oncancel= 'cancelChangeMenu'
      >
      </dialog-footer-admin>
    </el-dialog>
    
  </div>
</template>
<script>

import {
  getSysMenuList,
  updateSysMenuList,
  
} from '@/api/system/sysUser.js'

import waves from '@/directive/waves/index.js' // 水波纹指令

import {
  compareObj,
  cloneJSON,
  getRoleMenuChecked,
  transformRoleMenu
} from '@/utils/common.js'

function adapt(data) {
  return data;
}
let addId = 10000;
export default {
  name: 'sysMenuList',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      filterText: '',
      defaultChecked: [],
      menuData: [],
      rawMenuData: [],
      dialogRoleMenuVisible : false
    }
  },
  computed: {
    adminPassword(){
      return this.$store.state.user.adminPassword
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysMenuList().then(response => {
        let _data = response.data.data
        _data = transformRoleMenu(_data)
        let data = [{
          "id": -1,
          "label": "顶级",
          "children": _data
        }]
        this.rawMenuData = cloneJSON(data)
        this.menuData = cloneJSON(data);
        this.listLoading = false
      })
    },
    resetTemp() {
      this.$store.commit('SET_ADMINPASSWORD', "")
    },
    handleChangeMenu(row) {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    cancelChangeMenu() {
      this.resetTemp();
      this.getList();
      this.dialogFormVisible = false;
    },
    updateChangeMenu() {
      let menuData = cloneJSON(this.menuData)
      if(compareObj(menuData, cloneJSON(this.rawMenuData))){
        this.cancelChangeMenu();
        this.$notify({ title: '取消', message: '更新数据无变化', type: 'warning', duration: 2000 })
        return
      }
      var updateForm = cloneJSON({
        menuData: menuData[0].children,
        adminPassword: this.adminPassword
      })
      this.listLoading = true
      this.cancelChangeMenu();
      console.log(updateForm)
      updateSysMenuList(updateForm).then(() => {
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
    appendMenu(data) {
      this.$prompt('请输入菜单名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputErrorMessage: '菜单名称不正确'
      })
      .then(({ value }) => {
        let newChild = { id: 'N'+(addId++), label: value, children: [], parentId: data.id};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消',
          duration: 1000
        })
      });
    },
    appendFunc(data) {
      this.$prompt('请输入功能名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputErrorMessage: '功能名称不正确'
      })
      .then(({ value }) => {
        let newChild = { id: 'N'+(addId++), label: value, children: [], parentId: data.id, isFunc: true};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消',
          duration: 1000
        })
      });
    },
    removeMenu(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    editMenu(data){
      this.$prompt('请输入菜单名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputErrorMessage: '菜单名称不正确'
      })
      .then(({ value }) => {
        data.label= value
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消',
          duration: 1000
        })
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      var hideTop = data.id == -1 ? 'display: none;' : 'font-size: 12px; margin-left: 10px;';
      var hideFunc =  data.isFunc ? 'display: none;' : 'font-size: 12px;';
      var toggleExpand = (node)=>{
        if(node.expanded){
          node.collapse()
        }else if(node.childNodes && node.childNodes.length > 0){
          node.expand()
        }
      }
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span style={data.isFunc ? 'display:none' : ''}  on-click={ () => toggleExpand(node) } >{node.label}</span>
            <el-button type="text" style={!data.isFunc ? 'display:none' : 'font-size: 12px;color: #97a1be'}>{node.label}</el-button>
          </span>
          <span>
            <span style="font-size: 12px;margin-right:12px;width:6em;text-align:left;display:inline-block" type="text">ID: [ { data.id } ]</span>
            <span style="width:220px;display:inline-block">
              <el-button style={hideTop} type="text" on-click={ () => this.editMenu(data) }>编辑</el-button>
              <el-button style={hideTop} type="text" on-click={ () => this.removeMenu(node, data) }>删除</el-button>
              <el-button style={ hideFunc } type="text" on-click={ () => this.appendMenu(data) }>添加子菜单</el-button>
              <el-button style={ (data.id == -1 || data.isFunc) ? 'display: none;' : 'font-size: 12px;' } type="text" on-click={ () => this.appendFunc(data) }>添加子功能</el-button>
            </span>
          </span>
        </span>
      );
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
.el-tree-node__content{
  display: flex;
  align-items: center;
}
</style>
