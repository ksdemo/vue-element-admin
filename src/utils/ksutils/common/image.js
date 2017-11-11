export function uploadPreview(option, callback) {
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL
  var res,
    button = option.button,
    input = option.input,
    image = option.image,
    revoke = option.revoke, // 如果为true,则加载完立刻回收资源;
    maxsize = option.maxsize || 5000 // 图片大小, 单位KB
  callback = callback || option.callback
  if (!input) {
    return
  }
  button && button.addEventListener('click', function(e) {
    input.click()
  })
  input.addEventListener('change', function(e) {
    // 移动端微信会过滤尾缀
    if (!/image|\.jpeg|\.jpg|\.gif|\.png|\.bmp/i.test(this.value)) {
      res = {
        'success': false,
        'message': '上传图片的类型不符要求'
      }
      console.error(res.message)
      typeof callback === 'function' && callback(res)
      return
    }
    e.preventDefault() // 阻止默认事件
    var file = this.files[0]
    if (file) {
      if (file.size > maxsize * 1024) {
        res = {
          'success': false,
          'message': '图片大小不能超过' + maxsize + 'KB!'
        }
        console.error(res.message)
        typeof callback === 'function' && callback(res)
        return
      }
      var read = new FileReader() // 新建一个读取文件对象
      read.readAsDataURL(file) // 读取文件
      // 可用 read.onreadystatechange
      read.onload = function() { // 读取成功后回调
        read.onload = null
        var objectURL = window.URL.createObjectURL(file)
        res = {
          'success': true,
          'data': read.result, // 传入base64数据格式
          'url': objectURL
        }
        typeof callback === 'function' && callback(res)
        if (image) {
          image.src = objectURL
          if (revoke) {
            image.onload = function() {
              window.URL.revokeObjectURL(objectURL)
            }
          }
        }
      }
    } else {
      res = {
        'success': false,
        'message': '运行环境错误,图片读取失败!'
      }
      console.error(res.message)
      typeof callback === 'function' && callback(res)
      return
    }
  })
}
