import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    { path: '/test', component: Layout, name:'test', icon: 'bug', noDropdown: true,
        children:[ { path: 'index', component: _import('test/test') , name: '调试页面'} ]
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: '首页',
      hidden: true,
      children: [{ path: 'dashboard', component: _import('dashboard/index') }]
    }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/itcUser',
    component: Layout,
    redirect: 'noredirect',
    name: 'itcUser',
    meta: { label: '用户管理' },
    icon: 'user',
    children: [
      { path: 'itcUserList', component: _import('itc/itcUser/itcUserList'), name: 'itcUserList', meta: { label: '普通用户' }},
      { path: 'itcDriverList', component: _import('itc/itcUser/itcUserList'), name: 'itcDriverList', meta: { label: '司机用户' } }
    ]
  },
  {
    path: '/itcOrder',
    component: Layout,
    redirect: 'noredirect',
    name: '订单管理',
    meta: { label: '订单管理' },
    icon: 'clipboard',
    children: [
      { path: 'itcOrderList', component: _import('itc/itcUser/itcUserList'), name: 'itcOrderList', meta: { label: '订单列表' }},
      { path: 'itcOrderReturnList', component: _import('itc/itcUser/itcUserList'), name: 'itcOrderReturnList', meta: { label: '退货单管理' } }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: 'system',
    meta: { menuId: 1 ,label: '系统管理' },
    icon: 'example',
    children: [
      {
        path: '/system/sysPermission',
        component: _import('example/table/index'),
        redirect: '/system/sysPermission/sysUserList',
        name: 'sysPermission',
        meta: { menuId: 11, label: '用户管理' },
        children: [
          { path: 'sysUserList', component: _import('system/sysPermission/sysUserList'), name: 'sysUserList',  meta: { menuId: 111 ,label: '用户管理'} },
          { path: 'sysRoleList', component: _import('system/sysPermission/sysRoleList'), name: 'sysRoleList', meta: { menuId: 112 , label: '角色管理'} },
          { path: 'sysMenuList', component: _import('system/sysPermission/sysMenuList'), name: 'sysMenuList', meta: { menuId: 113 , label: '菜单管理'} }
        ]
      },
      {
        path: '/system/configs',
        component: _import('example/table/index'),
        redirect: 'noredirect',
        name: 'sysConfigs',
        meta: { label: '配置管理'},
        children: [
          { path: '/system/configs/platform', 
            component: _import('example/table/index'), 
            redirect: 'noredirect',
            name: 'sysPlatform',
            meta: {label: '平台管理'},
            children: [
              { path: 'platformList', component: _import('system/configs/platform/platformList'), name: 'platformList', meta: {label: '平台列表'} },
              { path: 'authAccountList', component: _import('system/configs/platform/authAccountList'), name: 'authAccountList', meta: {label: '授权帐号'} },
              { path: 'resourcesList', component: _import('system/configs/platform/resourceList'), name: 'resourcesList', meta: {label: '授权接口'}  }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'lock',
    noDropdown: true,
    children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页' }]
  },
  {
    path: '/icon',
    component: Layout,
    icon: 'icon',
    noDropdown: true,
    children: [{ path: 'index', component: _import('svg-icons/index'), name: 'icons' }]
  },
  
  {
    path: '/components',
    component: Layout,
    redirect: '/components/tinymce',
    name: '组件',
    icon: 'component',
    children: [
      { path: 'tinymce', component: _import('components/tinymce'), name: '富文本编辑器' },
      { path: 'markdown', component: _import('components/markdown'), name: 'Markdown' },
      { path: 'jsoneditor', component: _import('components/jsonEditor'), name: 'JSON编辑器' },
      { path: 'dndlist', component: _import('components/dndList'), name: '列表拖拽' },
      { path: 'splitpane', component: _import('components/splitpane'), name: 'SplitPane' },
      { path: 'avatarupload', component: _import('components/avatarUpload'), name: '头像上传' },
      { path: 'dropzone', component: _import('components/dropzone'), name: 'Dropzone' },
      { path: 'sticky', component: _import('components/sticky'), name: 'Sticky' },
      { path: 'countto', component: _import('components/countTo'), name: 'CountTo' },
      { path: 'mixin', component: _import('components/mixin'), name: '小组件' },
      { path: 'backtotop', component: _import('components/backToTop'), name: '返回顶部' }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/index',
    name: '图表',
    icon: 'chart',
    children: [
      { path: 'index', component: _import('charts/index'), name: '介绍' },
      { path: 'keyboard', component: _import('charts/keyboard'), name: '键盘图表' },
      { path: 'keyboard2', component: _import('charts/keyboard2'), name: '键盘图表2' },
      { path: 'line', component: _import('charts/line'), name: '折线图' },
      { path: 'mixchart', component: _import('charts/mixChart'), name: '混合图表' }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: '综合实例',
    icon: 'example',
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/table',
        name: 'Table',
        icon: 'table',
        children: [
          { path: 'dynamictable', component: _import('example/table/dynamictable/index'), name: '动态table' },
          { path: 'dragtable', component: _import('example/table/dragTable'), name: '拖拽table' },
          { path: 'inline_edit_table', component: _import('example/table/inlineEditTable'), name: 'table内编辑' },
          { path: 'table', component: _import('example/table/table'), name: '综合table' }
        ]
      },
      { path: 'form/edit', icon: 'form', component: _import('example/form'), name: '编辑Form', meta: { isEdit: true }},
      { path: 'form/create', icon: 'form', component: _import('example/form'), name: '创建Form' },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'Tab' }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    icon: '404',
    children: [
      { path: '401', component: _import('errorPage/401'), name: '401' },
      { path: '404', component: _import('errorPage/404'), name: '404' }
    ]
  },
  {
    path: '/errlog',
    component: Layout,
    redirect: 'noredirect',
    name: 'errlog',
    icon: 'bug',
    noDropdown: true,
    children: [{ path: 'log', component: _import('errlog/index'), name: '错误日志' }]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/download',
    name: 'excel',
    icon: 'excel',
    children: [
      { path: 'download', component: _import('excel/index'), name: 'export excel' },
      { path: 'download2', component: _import('excel/selectExcel'), name: 'export selected' },
      { path: 'upload', component: _import('excel/uploadExcel'), name: 'upload excel' }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    name: 'zip',
    icon: 'zip',
    children: [
      { path: 'download', component: _import('zip/index'), name: 'export zip' }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    name: 'theme',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: _import('theme/index'), name: '换肤' }]
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    icon: 'clipboard',
    noDropdown: true,
    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboard' }]
  },
  /* */
  { path: '*', redirect: '/404', hidden: true }
]
