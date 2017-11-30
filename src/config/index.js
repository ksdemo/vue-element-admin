// 授权ID
export const AUTH_CLIENT_ID = 'cms_client';
export const AUTH_CLIENT_SECRET = '123456';

export const AUTH_PASSWORD_ID = 'cms_password'
export const AUTH_PASSWORD_SECRET = '123456'

// 授权帐号可用状态
export const statusTypeOptions = [
  {'key': 1,'label': '正常', 'tag': 'success'},
  {'key': 0,'label': '已禁用', 'tag': 'danger'}
]

// 授权帐号的授权类型
export const clientTypeOptions = [
  {
    'key': 0,
    'label': '客户端授权'
  }, {
    'key': 1,
    'label': '密码授权'
  }
]

// 后台用户的登录方式, 未启用
export const sysUserLoginType = [
  {
    'key': 0,
    'label': '验证码登录'
  }, {
    'key': 1,
    'label': '手机登录'
  }
]

// itc用户的实名认证提交状态
export const idcardCertOptions = [
  {
    'key': 0,
    'label': '未提交',
    'tag': 'warning'
  }, {
    'key': 1,
    'label': '已提交',
    'tag': 'primary'
  }
]

// itc用户的实名认证结果
export const idcardCertStateOptions = [
  {
    'key': 0,
    'label': '失败',
    'tag': 'danger'
  }, {
    'key': 1,
    'label': '成功',
    'tag': 'success'
  }
]

export const idSortOptions =  [
  {
    label: '按ID升序列',
    key: 1
  }, {
    label: '按ID降序',
    key: 2
  }
]