'use strict'
export default {
  'mobile': {
    test: 'mobile',
    message: '请输入正确的电话号码'
  },
  'someAsyncFn': [
    {
      test: function (data, callback) {
        setTimeout(function(){
          callback( Math.random() > 0.5)
        },200)
      },
      async: true,  // 声明异步
      message: '这是一个随机的异步验证结果'
    }
  ]
}
