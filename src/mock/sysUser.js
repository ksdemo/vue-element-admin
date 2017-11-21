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
        "roleId": 1,
        "mobile": "18678830362",
        "name": "dongdong",
        "roleName": "管理员",
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
        "menuId": 1,
        "name": "系统管理",
        "url": "orderMinaList",
        "parentId": 0,
        "level": 1,
        "checkbox": true,
        "funcs": [],
        "menus": [
          {
            "menuId": 11,
            "name": "权限管理",
            "url": "orderMinaList",
            "parentId": 1,
            "level": 2,
            "checkbox": true,
            "menus": [{
                "menuId": 111,
                "name": "系统用户",
                "code": "ReturnGoods",
                "checkbox": false
              }, {
                "menuId": 112,
                "name": "系统角色",
                "code": "cancelReturnGoods",
                "checkbox": true,
                "funcs":[
                  {
                    "funcId": 1111,
                    "name": "添加",
                    "code": "refund",
                    "checkbox": true
                  },{
                    "funcId": 1112,
                    "name": "删除",
                    "code": "refund",
                    "checkbox": false
                  },{
                    "funcId": 1113,
                    "name": "编辑",
                    "code": "refund",
                    "checkbox": true
                  },{
                    "funcId": 1114,
                    "name": "关联菜单",
                    "code": "refund",
                    "checkbox": false
                  }
                ]
              }, {
                "menuId": 113,
                "name": "系统菜单",
                "code": "refund",
                "checkbox": false
              }]
          }, 
          {
            "menuId": 12,
            "name": "配置管理",
            "url": "orderMinaReturnList",
            "parentId": 1,
            "level": 3,
            "checkbox": true,
            "menus": [
              {
                "menuId": 114,
                "name": "平台管理",
                "code": "cancelReturnGoods",
                "checkbox": false,
                "menus": [
                  {
                    "menuId": 1115,
                    "name": "平台列表",
                    "code": "cancelReturnGoods",
                    "checkbox": true
                  },
                  {
                    "menuId": 1116,
                    "name": "授权帐号",
                    "code": "cancelReturnGoods",
                    "checkbox": false
                  },
                  {
                    "menuId": 1116,
                    "name": "授权接口",
                    "code": "cancelReturnGoods",
                    "checkbox": false
                  }
                ]
              }, 
              {
                "menuId": 115,
                "name": "其他管理",
                "code": "refund",
                "checkbox": false
              }
            ]
          }
        ]
      }]
    }
  }
}
