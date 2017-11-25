import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
// 平台
import platformAPI from './system/sysConfigsPlatform'
// 系统用户
import sysUserAPI from './system/sysUser'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

//系统管理

//平台管理
Mock.mock(/\/system\/configs\/platform\/platformList/, 'get', platformAPI.getPlatformList)
// 授权帐号
Mock.mock(/\/system\/configs\/platform\/authAccountList/, 'get', platformAPI.getAuthAccountList)
Mock.mock(/\/system\/configs\/platform\/authAccountInfo/, 'get', platformAPI.getAuthAccountInfo)
Mock.mock(/\/system\/configs\/platform\/platformAll/, 'get', platformAPI.getPlatformAll)
Mock.mock(/\/system\/configs\/platform\/getAuthAccountResource/, 'get', platformAPI.getAuthAccountResource)
// 授权接口
Mock.mock(/\/system\/configs\/platform\/resourceList/, 'get', platformAPI.resourceList)
Mock.mock(/\/system\/configs\/platform\/resourceInfo/, 'get', platformAPI.resourceInfo)
Mock.mock(/\/system\/configs\/platform\/resourceServiceList/, 'get', platformAPI.resourceServiceList)
Mock.mock(/\/system\/configs\/platform\/getResourceAccount/, 'get', platformAPI.getResourceAccount)

// 权限管理 用户管理
// 系统用户列表
Mock.mock(/\/system\/configs\/sysPermission\/getSysUserList/, 'get', sysUserAPI.getSysUserList)
// 系统用户资料
Mock.mock(/\/system\/configs\/sysPermission\/getSysUserInfo/, 'get', sysUserAPI.getSysUserInfo)
// 系统角色列表
Mock.mock(/\/system\/configs\/sysPermission\/getSysRoleList/, 'get', sysUserAPI.getSysRoleList)
// 系统角色关联菜单
Mock.mock(/\/system\/configs\/sysPermission\/getSysRoleMenuRight/, 'get', sysUserAPI.getSysRoleMenuRight)

// 系统菜单列表
Mock.mock(/\/system\/configs\/sysPermission\/getSysMenuList/, 'get', sysUserAPI.getSysRoleMenuRight)
export default Mock
