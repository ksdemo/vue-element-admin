import Mock from 'mockjs'
import { param2Obj } from '@/utils'

export default {
  // ITC用户列表
  getItcUserList(config) {
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
        "is_idcard_cert": 0,
        "idcard_cert_state": "",
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
        "is_idcard_cert": 0,
        "idcard_cert_state": 0,
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
        "is_idcard_cert": 0,
        "idcard_cert_state": 1,
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
        "is_idcard_cert": 1,
        "idcard_cert_state": 0,
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
        "is_idcard_cert": 1,
        "idcard_cert_state": 1,
        "account": "test",
        "email": "test@qq.com"
      }],
      "total": 17,
      "size": 10,
      "pages": 2,
      "pageNum": 1,
      "pageSize": 10
    }
  },
  // ITC用户信息 未启用
  getItcUserInfo(config) {
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
  getItcIdcertInfo(){
  return {  
      "code": 1,
      "msg": "成功",
      "data": {
        "user_id": "1",
        "realname": "张三",
        "idNum": "431000000000000000",
        "faceImg": "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=477576474,3698736735&fm=173&s=03E6DC054440F75156B8518E0300C091&w=600&h=431&img.JPEG",
        "backImg": ""
      }
    }
  }
}
