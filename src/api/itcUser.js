import fetch from '@/utils/fetch'
import {request} from '@/utils/common.js'
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
export function getItcUserList(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 查询用户信息 未启用
export function getItcUserInfo(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserInfo',
    method: 'get',
    params: query
  })
}
// 获取用户角色
export function getItcUserRole(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserRole',
    method: 'get',
    params: query
  })
}

// 创建用户帐号
export function createItcUser(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

// 修改用户信息
export function updateItcUser(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

// 修改用户状态
export function updateItcUserStatus(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 修改用户角色
export function updateItcUserRole(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}
// 修改用户密码
export function updateItcUserPass(query) {
  return fetch({
    url: '/system/configs/sysPermission/getSysUserList',
    method: 'get',
    params: query
  })
}

/* 系统用户 相关 E */
