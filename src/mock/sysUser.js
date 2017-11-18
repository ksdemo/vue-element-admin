import Mock from 'mockjs'
import { param2Obj } from '@/utils'

export default {
  // 系统用户列表
  getSysUserList(config) {
    return {
      "code": 1,
      "msg": "成功",
      "data": [{
        "update_time": "2017-08-21 11:49:10",
        "create_time": "2017-08-21 11:48:39",
        "user_id": 17,
        "phone": "123",
        "login_type": 0,
        "roleId": null,
        "mobile": "13599999999",
        "name": "admin111123123",
        "roleName": "",
        "state": 0,
        "account": "hello",
        "email": "1233@qq.com"
      }, {
        "update_time": "2017-08-21 11:46:03",
        "create_time": "2017-08-21 11:46:03",
        "user_id": 16,
        "phone": "123",
        "login_type": 0,
        "roleId": 11,
        "mobile": "18644444422",
        "name": "test权限分配",
        "roleName": "yx",
        "state": 1,
        "account": "abc",
        "email": "12@qq.com"
      }, {
        "update_time": "2017-08-16 14:26:06",
        "create_time": "2017-08-16 14:26:06",
        "user_id": 15,
        "phone": "1234",
        "login_type": 0,
        "roleId": 10,
        "mobile": "13570925861",
        "name": "陈创斌",
        "roleName": "运维管理",
        "state": 1,
        "account": "lotus",
        "email": "chuangbing.cheng@cplotus.com"
      }, {
        "update_time": "2017-08-11 09:12:37",
        "create_time": "2017-08-10 16:02:41",
        "user_id": 14,
        "phone": "2121",
        "login_type": 0,
        "roleId": 8,
        "mobile": "18677755544",
        "name": "ewe123",
        "roleName": "门店测试用户",
        "state": 1,
        "account": "aa",
        "email": "111@qq.com"
      }, {
        "update_time": "2017-08-10 16:01:52",
        "create_time": "2017-07-20 09:40:30",
        "user_id": 13,
        "phone": "test",
        "login_type": 0,
        "roleId": null,
        "mobile": "18678830360",
        "name": "test",
        "roleName": "",
        "state": 1,
        "account": "test",
        "email": "test@qq.com"
      }, {
        "update_time": "2017-05-26 21:26:35",
        "create_time": "2017-05-26 21:26:35",
        "user_id": 12,
        "phone": "123",
        "login_type": 0,
        "roleId": 4,
        "mobile": "13800138001",
        "name": "test0526",
        "roleName": "订单管理员",
        "state": 1,
        "account": "test0526",
        "email": "123@qq.com"
      }, {
        "update_time": "2017-07-12 15:14:13",
        "create_time": "2017-05-26 01:14:54",
        "user_id": 11,
        "phone": "1111",
        "login_type": 0,
        "roleId": 8,
        "mobile": "12345678909",
        "name": "test",
        "roleName": "门店测试用户",
        "state": 1,
        "account": "014test",
        "email": "andy.qin@cplotus.com"
      }, {
        "update_time": "2017-05-25 00:32:23",
        "create_time": "2017-05-24 18:36:14",
        "user_id": 10,
        "phone": "123",
        "login_type": 0,
        "roleId": 4,
        "mobile": "13800138000",
        "name": "test0524",
        "roleName": "订单管理员",
        "state": 1,
        "account": "test0524",
        "email": "123@qq.com"
      }, {
        "update_time": "2017-08-21 13:18:21",
        "create_time": "2017-05-19 22:18:19",
        "user_id": 9,
        "phone": "3325",
        "login_type": 0,
        "roleId": 11,
        "mobile": "18678830361",
        "name": "xixi",
        "roleName": "yx",
        "state": 1,
        "account": "chenxixi",
        "email": "18678830361@qq.com"
      }, {
        "update_time": "2017-05-19 21:41:28",
        "create_time": "2017-05-19 19:03:41",
        "user_id": 8,
        "phone": "3368",
        "login_type": 1,
        "roleId": null,
        "mobile": "18678830362",
        "name": "dongdong",
        "roleName": "",
        "state": 1,
        "account": "chendongdong",
        "email": "chendongdong@qq.com"
      }],
      "total": 17,
      "size": 10,
      "pages": 2,
      "pageNum": 1,
      "pageSize": 10
    }
  },
  // 系统用户信息
  getSysUserInfo(config) {
    return {
      "code": 1,
      "msg": "成功",
      "data": {
        "update_time": "2017-05-19 21:41:28",
        "create_time": "2017-05-19 19:03:41",
        "user_id": 8,
        "phone": "3368",
        "login_type": 1,
        "roleId": null,
        "mobile": "18678830362",
        "name": "dongdong",
        "roleName": "",
        "state": 1,
        "account": "chendongdong",
        "email": "chendongdong@qq.com"
      }
    }
  },
  // 系统角色列表
  getSysRoleList() {
    return {
      "code": 0,
      "msg": "成功",
      "data": [{
        "roleId": 1,
        "name": "超级管理员",
        "description": "拥有所有访问权限"
      }, {
        "roleId": 2,
        "name": "普通管理员",
        "description": "普通管理员"
      }, {
        "roleId": 4,
        "name": "订单管理员",
        "description": "订单管理员2"
      }, {
        "roleId": 7,
        "name": "门店店长",
        "description": "门店店长"
      }, {
        "roleId": 8,
        "name": "门店测试用户",
        "description": "服务台测试订单管理"
      }, {
        "roleId": 10,
        "name": "运维管理",
        "description": "运维管理"
      }, {
        "roleId": 11,
        "name": "yx",
        "description": "对账管理"
      }]
    }
  },
  // 系统角色关联菜单
  getSysRoleMenuRight() {
    return {
      "code": 1,
      "msg": "成功",
      "data": [{
        "menuId": 11,
        "name": "小程序订单管理",
        "url": "orderMinaList",
        "parentId": 2,
        "level": 2,
        "checkbox": true,
        "funcs": [],
        "menus": [{
          "menuId": 12,
          "name": "小程序订单列表",
          "url": "orderMinaList",
          "parentId": 11,
          "level": 3,
          "checkbox": true,
          "funcs": [{
            "funcId": 40,
            "menuId": 12,
            "name": "退货",
            "code": "ReturnGoods",
            "checkbox": true
          }, {
            "funcId": 41,
            "menuId": 12,
            "name": "取消退货",
            "code": "cancelReturnGoods",
            "checkbox": true
          }, {
            "funcId": 42,
            "menuId": 12,
            "name": "退款",
            "code": "refund",
            "checkbox": true
          }]
        }, {
          "menuId": 13,
          "name": "退货单管理",
          "url": "orderMinaReturnList",
          "parentId": 11,
          "level": 3,
          "checkbox": false,
          "funcs": [{
            "funcId": 43,
            "menuId": 13,
            "name": "取消退货",
            "code": "cancelReturnGoods",
            "checkbox": false
          }, {
            "funcId": 44,
            "menuId": 13,
            "name": "退款",
            "code": "refund",
            "checkbox": false
          }]
        }]
      }, {
        "menuId": 30,
        "name": "小程序对账",
        "url": "billMinaList",
        "parentId": 2,
        "level": 2,
        "checkbox": true,
        "funcs": [],
        "menus": [{
          "menuId": 31,
          "name": "对账查询",
          "url": "billQueryResult",
          "parentId": 30,
          "level": 3,
          "checkbox": true,
          "funcs": [{
            "funcId": 58,
            "menuId": 31,
            "name": "导出文件",
            "code": "export",
            "checkbox": true
          }]
        }, {
          "menuId": 32,
          "name": "微信明细查询",
          "url": "getWxBillDetails",
          "parentId": 30,
          "level": 3,
          "checkbox": true,
          "funcs": [{
            "funcId": 59,
            "menuId": 32,
            "name": "导出文件",
            "code": "export",
            "checkbox": true
          }, {
            "funcId": 61,
            "menuId": 32,
            "name": "查看详情",
            "code": "detail",
            "checkbox": false
          }]
        }, {
          "menuId": 33,
          "name": "对账汇总",
          "url": "queryStatisticsResult",
          "parentId": 30,
          "level": 3,
          "checkbox": true,
          "funcs": [{
            "funcId": 60,
            "menuId": 33,
            "name": "导出文件",
            "code": "export",
            "checkbox": true
          }]
        }]
      }, {
        "menuId": 38,
        "name": "报表管理",
        "url": "reportManage",
        "parentId": 2,
        "level": 2,
        "checkbox": true,
        "funcs": [],
        "menus": [{
          "menuId": 39,
          "name": "订单报表",
          "url": "orderReportManage",
          "parentId": 38,
          "level": 3,
          "checkbox": true,
          "funcs": []
        }]
      }]
    }
  },
  // 系统菜单列表
  getSysMenuList() {
    return {
      "code": 1,
      "msg": "成功",
      "data": [{
        "menuId": 7,
        "name": "权限管理",
        "url": "authority",
        "parentId": 6,
        "state": 1,
        "level": 2,
        "img": null,
        "sort": 1,
        "menu": [{
          "menuId": 8,
          "name": "用户管理",
          "url": "userManager",
          "parentId": 7,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 1
        }, {
          "menuId": 9,
          "name": "角色管理",
          "url": "roleManager",
          "parentId": 7,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 2
        }, {
          "menuId": 10,
          "name": "菜单管理",
          "url": "menuManager",
          "parentId": 7,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 3
        }]
      }, {
        "menuId": 25,
        "name": "配置管理",
        "url": "configManager",
        "parentId": 6,
        "state": 1,
        "level": 2,
        "img": null,
        "sort": 2,
        "menu": [{
          "menuId": 28,
          "name": "支付管理",
          "url": "settingPay",
          "parentId": 25,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 1
        }, {
          "menuId": 29,
          "name": "平台账号管理",
          "url": "configPlateform",
          "parentId": 25,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 999
        }, {
          "menuId": 35,
          "name": "门店列表",
          "url": "queryOutletList",
          "parentId": 25,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 999
        }]
      }, {
        "menuId": 43,
        "name": "监控管理",
        "url": "goAccess",
        "parentId": 6,
        "state": 1,
        "level": 2,
        "img": null,
        "sort": 999,
        "menu": [{
          "menuId": 44,
          "name": "Nginx监控",
          "url": "goAccess",
          "parentId": 43,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 999
        }, {
          "menuId": 45,
          "name": "Druid监控",
          "url": "druid",
          "parentId": 43,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 999
        }, {
          "menuId": 46,
          "name": "Tomcat监控",
          "url": "tomcat",
          "parentId": 43,
          "state": 1,
          "level": 3,
          "img": null,
          "sort": 999
        }]
      }]
    }
  }
}
