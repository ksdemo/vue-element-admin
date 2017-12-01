import {request, cloneJSON} from '@/utils/common.js'
import md5 from 'js-md5';
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
  var data = cloneJSON(query)
  data.adminPassword = md5(data.adminPassword)
  return request({
    url: '/cms/oauth2Client/platformUpdate',
    method: 'post',
    data
  })
}

// 修改平台状态
export function modifyStatusPlatform(query) {
    var data = cloneJSON(query)
    data.adminPassword = md5(data.adminPassword)
    return request({
      url: '/cms/oauth2Client/platformChangeState',
      method: 'post',
      data
    })
}
