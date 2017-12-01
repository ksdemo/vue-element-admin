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
export function getItcDriverList(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}
// 查询用户信息 未启用
export function getItcDriverInfo(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 创建用户帐号
export function createItcDriver(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 修改用户信息
export function updateItcDriver(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 用户状态 改
export function updateItcDriverStatus(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 用户密码 改
export function updateItcDriverPass(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 用户实名认证信息 增
export function createItcIdcert(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 用户实名认证信息 查 
export function getItcIdcertInfo(query) {
  return fetch({
    url: '/itc/itcUser/getItcIdcertInfo',
    method: 'get',
    params: query
  })
}

// 用户实名认证信息 改 
export function updateItcIdcert(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}

// 用户实名认证状态 改 
export function updateItcIdcertState(query) {
  return fetch({
    url: '/itc/itcDriver/getItcDriverList',
    method: 'get',
    params: query
  })
}


/* 系统用户 相关 E */
