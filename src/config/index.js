// 授权ID
export const AUTH_CLIENT_ID = 'cms_client';
export const AUTH_CLIENT_SECRET = '123456';

export const AUTH_PASSWORD_ID = 'cms_password'
export const AUTH_PASSWORD_SECRET = '123456'

// 授权帐号可用状态
export const statusTypeOptions = [
  {'key': 1,'display_name': '正常', 'tag': 'success'},
  {'key': 0,'display_name': '已禁用', 'tag': 'danger'}
]

// 授权帐号的授权类型
export const clientTypeOptions = [
  {
    'key': 0,
    'display_name': '客户端授权'
  }, {
    'key': 1,
    'display_name': '密码授权'
  }
]

// 后台用户的登录方式, 未启用
export const sysUserLoginType = [
  {
    'key': 0,
    'display_name': '验证码登录'
  }, {
    'key': 1,
    'display_name': '手机登录'
  }
]
