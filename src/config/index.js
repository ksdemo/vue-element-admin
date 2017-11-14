// 授权帐号可用状态
var statusTypeOptions = [
  {'key': 1,'display_name':'正常', 'tag' : 'success'},
  {'key': 0,'display_name':'已禁用', 'tag' : 'danger'}
]

// 授权帐号的授权类型
var clientTypeOptions = [
  {
    'key': 2,
    'display_name': '客户端授权'
  }, {
    'key': 3,
    'display_name': '密码授权'
  }
]
export { clientTypeOptions ,statusTypeOptions}
