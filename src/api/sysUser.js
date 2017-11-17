import fetch from '@/utils/fetch'
import {request} from '@/utils/add.js'
import md5 from 'js-md5';
/*
export function fetchList(query) {
  return request({
    url: '/article/list',
    type: 'get',
    data: query
  })
}
*/

/* 系统用户管理 相关 S */
// 查询用户列表
export function getSysUserList(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 查询用户信息
export function getSysUserInfo(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserInfo',
    method: 'get',
    params: query
  })
}
// 获取用户角色
export function getSysUserRole(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserRole',
    method: 'get',
    params: query
  })
}

// 创建用户帐号
export function createSysUser(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

// 修改用户信息
export function updateSysUser(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

// 修改用户状态
export function updateSysUserStatus(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 修改用户角色
export function updateSysUserRole(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 修改用户密码
export function updateSysUserPass(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

/* 系统用户 相关 E */

/* 系统角色 相关 S */
// 获取角色列表
export function getSysRoleList(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysRoleList',
    method: 'get',
    params: query
  })
}

// 获取角色菜单权限
export function getSysRoleMenu(query) {
  return fetch({
    url: '/system/configs/sysPermission/sresourceServiceList',
    method: 'get',
    params: query
  })
}

// 获取角色菜单功能点权限
export function getSysRoleMenuBtn(query) {
  return fetch({
    url: '/system/configs/sysPermission/sresourceServiceList',
    method: 'get',
    params: query
  })
}
/* 系统角色 相关 E */