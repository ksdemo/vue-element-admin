import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    clientCode: Mock.Random.natural(100, 10000),
    clientName: '@cname',
    clientTag: '@word',
    description: '@csentence',
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    'clientState|1': [0, 1] // 0冻结, 1正常
  }))
}

// 授权账户列表
const authAccountList = []
for (let i = 0; i < count; i++) {
  authAccountList.push(Mock.mock({
    id: '@increment',
    clientCode: Mock.Random.natural(100, 10000),
    clientTag: '@word',
    clientName: '@csentence',
    accessTokenExpires: 7200,
    refreshTokenExpires: 2592000,
    description: '@csentence',
    'clientState|1': [0, 1] // 0冻结, 1正常
  }))
}

// 授权账户信息
const authAccountInfo = []
for (let i = 0; i < count; i++) {
  authAccountInfo.push(Mock.mock({
    id: '@increment',
    clientCode: Mock.Random.natural(100, 10000),
    clientTag: '@word',
    clientName: '@csentence',
    accessTokenExpires: 7200,
    refreshTokenExpires: 2592000,
    description: '@csentence',
    'clientState|1': [0, 1] // 0冻结, 1正常
  }))
}

export default {
  getPlatformList: config => {
    const {clientName, pageNo = 1, pageSize = 20, sort} = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (clientName && item.clientName.indexOf(clientName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

    return {
      code: 0,
      msg: '',
      totalPages: Math.ceil(mockList.length / pageSize),
      totalCount: mockList.length,
      pageSize: pageSize,
      pageNo: pageNo,
      data: pageList
    }
  },

  getAuthAccountList: config => {
    const {clientName, pageNo = 1, pageSize = 20, sort} = param2Obj(config.url)

    let mockList = authAccountList.filter(item => {
      if (clientName && item.clientName.indexOf(clientName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

    return {
      code: 0,
      msg: '',
      totalPages: Math.ceil(mockList.length / pageSize),
      totalCount: mockList.length,
      pageSize: pageSize,
      pageNo: pageNo,
      data: pageList
    }
  },

  // 授权账户信息
  getAuthAccountInfo(config) {
    return {
      "code": 1,
      "msg": null,
      "data": {
        "parentId": 100,
        "clientType": 0,
        "clientCode": 101,
        "clientParentCode": 100,
        "clientState": 1,
        "clientTag": "manager_client",
        "clientName": "综合后台管理系统平台客户端授权",
        "description": "用于登录时获取相关验证码、短信等接口的授权；",
        "clientId": "oauth_101_client",
        "clientPassword": "wlfe5wqi8don",
        "accessTokenExpires": 7200,
        "refreshTokenExpires": 2592000,
        "clientIps": null,
        "wxAppId": null,
        "wxAppSecurt": null,
        "smsUsername": "HE0055",
        "smsPassword": "130008",
        "smsUrl": "http://TSUM2.800CT.COM:8895/MWGate/wmgw.asmx",
        "outletType": null,
        "createTime": "2017-03-17 23:20:59",
        "updateTime": "2017-08-23 15:55:25"
      }
    }
  },
  // 所有平台信息,用于授权账户选择平台
  getPlatformAll() {
    return {
      "code": 1,
      "msg": null,
      "data": [{
        "id": 1,
        "parentId": 0,
        "clientType": 1,
        "clientCode": 100,
        "clientParentCode": 0,
        "clientState": 1,
        "clientTag": "manager",
        "clientName": "综合后台管理系统平台",
        "description": "主要用于后台管理系统接入"
      }, {
        "id": 2,
        "parentId": 0,
        "clientType": 1,
        "clientCode": 300,
        "clientParentCode": 0,
        "clientState": 1,
        "clientTag": "lotusgo_platform",
        "clientName": "莲花GO平台",
        "description": "莲花GO平台的接入点；"
      },{
        "id": 3,
        "parentId": 0,
        "clientType": 1,
        "clientCode": 1100,
        "clientParentCode": 0,
        "clientState": 1,
        "clientTag": "o2oweb",
        "clientName": "莲花GO微信商城",
        "description": "莲花GO微信商城"
      }]
    }
  }
}
