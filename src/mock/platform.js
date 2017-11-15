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
    'clientState|1': [0, 1], // 0冻结, 1正常
    'clientType|1': [0, 1] // 0客户端授权, 1密码授权
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
      }, {
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
  },
  // 授权账户获取关联接口
  getResource() {
    return {
      "code": 1,
      "msg": null,
      "data": [{
        "service": "lotusgo-service-pay",
        "serviceName": "支付服务",
        "list": [{
          "resId": 30,
          "name": "获取微信支付配置信息",
          "path": "/pay/getWxPaymentConfig",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": true
        }, {
          "resId": 31,
          "name": "微信支付",
          "path": "/pay/wxpay",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 32,
          "name": "订单支付前端成功",
          "path": "/pay/payFronSuc",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 34,
          "name": "获取订单支付信息",
          "path": "/pay/orderPayment",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": true
        }, {
          "resId": 35,
          "name": "调起微信退款",
          "path": "/pay/wxRefund",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 36,
          "name": "配置微信支付信息",
          "path": "/pay/wxConfigPayment",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 37,
          "name": "微信支付证书上传",
          "path": "/pay/wxCertUpload",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 244,
          "name": "后台-查询小程序账单接口",
          "path": "/accounting/queryResult",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 245,
          "name": "后台-导出小程序账单接口",
          "path": "/accounting/exportAccountingResult",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 246,
          "name": "后台-查询对账汇总接口",
          "path": "/accounting/queryStatisticsResult",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 247,
          "name": "后台-导出对账汇总接口",
          "path": "/accounting/exportStatisticsResult",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 248,
          "name": "后台-查询微信对账单接口",
          "path": "/pay/getWxBillDetails",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 249,
          "name": "后台-查询所有微信对账单接口",
          "path": "/pay/getWxBillDetailAll",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 250,
          "name": "后台-导出微信对账单接口",
          "path": "/pay/exportWxBillDetails",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }, {
          "resId": 251,
          "name": "后台-支付下载接口",
          "path": "/file/download",
          "service": "lotusgo-service-pay",
          "serviceName": "支付服务",
          "checkbox": false
        }]
      }, {
        "service": "lotusgo-service-goods",
        "serviceName": "商品服务",
        "list": [{
          "resId": 83,
          "name": "获取商品列表",
          "path": "/scanGoods/getGoodsList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": true
        }, {
          "resId": 84,
          "name": "获取商品信息",
          "path": "/scanGoods/getGoods",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": true
        }, {
          "resId": 85,
          "name": "获取商品SKU列表",
          "path": "/scanGoods/getGoodsSkuList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": true
        }, {
          "resId": 86,
          "name": "获取",
          "path": "/scanGoods/getHierarList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 87,
          "name": "获取商品图片列表",
          "path": "/scanGoods/getGoodsImageList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 88,
          "name": "搜索商品价格列表",
          "path": "/scanPrice/searchPriceList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 89,
          "name": "获取商品价格",
          "path": "/scanPrice/getPrice",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 90,
          "name": "获取商品价格列表",
          "path": "/scanPrice/getPriceList",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 222,
          "name": "前端-获取商品名称",
          "path": "/scanGoods/getGoodName",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }, {
          "resId": 223,
          "name": "后台-导出报表时需要查找翻页销售报表信息",
          "path": "/scanGoods/getHierar",
          "service": "lotusgo-service-goods",
          "serviceName": "商品服务",
          "checkbox": false
        }]
      }]
    }
  }
}
