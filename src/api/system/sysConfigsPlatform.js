import fetch from '@/utils/fetch'
import {request, cloneJSON} from '@/utils/common.js'
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
// 获取平台列表
export function getPlatformList(query) {
  return request({
    url: '/cms/oauth2Client/platformList',
    method: 'post',
    data: query
  })
}

// 创建平台
export function createPlatform(query) {
  var data = cloneJSON(query)
  data.adminPassword = md5(data.adminPassword)
  return request({
    url: '/cms/oauth2Client/platformAdd',
    method: 'post',
    data
  })
}

// 修改平台信息
export function updatePlatform(query) {
  return fetch({
    url: '/system/configs/platform/platformList',
    method: 'get',
    params: query
  })
}
// 修改平台状态
export function modifyStatusPlatform(query) {
  return fetch({
    url: '/system/configs/platform/platformList',
    method: 'get',
    params: query
  })
}
/* 授权账号 相关 S */
// 获取授权账号列表
export function getAuthAccountList(query) {
  return fetch({
    url: '/system/configs/platform/authAccountList',
    method: 'get',
    params:  {
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      clientName: query.clientName,
      sort: query.sort
    }
  })
}
// 获取授权账号信息
export function getAuthAccountInfo(clientCode) {
  return fetch({
    url: '/system/configs/platform/authAccountInfo',
    method: 'get',
    params: {clientCode}
  })
}

// 获取授权帐号关联接口
export function getAuthAccountResource(clientCode) {
  return fetch({
    url: '/system/configs/platform/getAuthAccountResource',
    method: 'get',
    params: {clientCode}
  })
}

  // 所有平台信息,用于授权账户选择平台
export function  getPlatformAll(parentId) {
    return fetch({
      url: '/system/configs/platform/platformAll',
      method: 'get',
      params: {
        parentId
      }
    })
  }
// 创建授权账号
export function createAuthAccount(query) {
  return fetch({
    url: '/system/configs/platform/authAccountList',
    method: 'get',
    params: query
  })
}

// 修改平台信息
export function updateAuthAccount(query) {
  return fetch({
    url: '/system/configs/platform/platformList',
    method: 'get',
    params: query
  })
}
// 修改平台状态
export function modifyStatusAuthAccount(query) {
  return fetch({
    url: '/system/configs/platform/platformList',
    method: 'get',
    params: query
  })
}

// 更新授权帐号关联接口
export function updateAuthAccountResource(data) {
  return fetch({
    url: '/system/configs/platform/platformList',
    method: 'get',
    params: {
      clientCode: data.clientCode,
      adminPassword: data.adminPassword,
      data: data.data
    }
  })
}
/* 授权账号 相关 E */
/* 授权接口 相关 S */
// 获取接口列表
export function getResourceList(query) {
  return fetch({
    url: '/system/configs/platform/resourceList',
    method: 'get',
    params: query
  })
}
// 获取接口信息
export function getResourceInfo(resId) {
  return fetch({
    url: '/system/configs/platform/resourceInfo',
    method: 'get',
    params: {resId}
  })
}
// 获取接口的所有服务列表
export function getServiceList(query) {
  return fetch({
    url: '/system/configs/platform/resourceServiceList',
    method: 'get',
    params: query
  })
}
// 获取接口关联帐号列表
export function getResourceAccount(query) {
  return fetch({
    url: '/system/configs/platform/getResourceAccount',
    method: 'get',
    params: query
  })
}
// 创建接口
export function createResource(query) {
  return fetch({
    url: '/system/configs/platform/resourceList',
    method: 'get',
    params: query
  })
}

// 修改接口信息
export function updateResource(query) {
  return fetch({
    url: '/system/configs/platform/resourceList',
    method: 'get',
    params: query
  })
}
// 修改接口状态
export function modifyStatusResource(query) {
  return fetch({
    url: '/system/configs/platform/resourceList',
    method: 'get',
    params: query
  })
}

// 更新接口关联的帐号
export function updateResourceAccount(data) {
  return fetch({
    url: '/system/configs/platform/resourceList',
    method: 'get',
    params: data
  })
}
/* 授权接口 相关 E */