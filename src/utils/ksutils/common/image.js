import EXIF from './lib/exif-js/exif.js'

function imgReader(file, options, cb) {
  if (!file) return;
  // 移动端
  options.maxWidth = options.maxWidth || 800;
  options.maxHeight = options.maxHeight || 1200;
  options.maxSize = options.maxSize || 1024 * 1e3; // 1M, 单位kb
  let Orientation
  EXIF.getData(file, function() {
    Orientation = EXIF.getTag(file, 'Orientation');
  });
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    reader.onload = null
    var base64 = reader.result;
    var image = new Image();
    image.src = base64;
    image.onload = function() {
      // resize
      var expectRect = getExpectRect(this, options)
      var expectWidth = expectRect.width;
      var expectHeight = expectRect.height;
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = expectWidth;
      canvas.height = expectHeight;
      ctx.drawImage(this, 0, 0, expectWidth, expectHeight);

      //rotate 修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            rotateImg(this, 'left', canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            rotateImg(this, 'right', canvas);
            break;
          case 3: //需要180度旋转
            rotateImg(this, 'right', canvas); //转两次
            rotateImg(this, 'right', canvas);
            break;
        }
      }

      base64 = canvas.toDataURL("image/jpeg", 0.8);
      let scale = file.size / options.maxSize
      if (scale > 1) {
        imgScale(base64, options.scale, _base64 => {
          cb && cb(_base64)
        })
      } else {
        cb && cb(base64)
      }
      console.log(base64);
    };
  }
}
function imgResize(src,){

}
// 获取缩放宽高
function getExpectRect(image, options) {
  var naturalWidth = image.naturalWidth;
  var naturalHeight = image.naturalHeight;
  var P = naturalWidth / naturalHeight;
  var expectWidth = image.naturalWidth;
  var expectHeight = image.naturalHeight;
  if (options.width && options.height) {
    expectWidth = options.width
    expectHeight = options.height
  } else if (options.width) {
    expectWidth = options.width
    expectHeight = expectWidth / P
  } else if (options.height) {
    expectHeight = options.height
    expectWidth = expectHeight * P
  } else if (naturalWidth > naturalHeight && naturalWidth > options.maxWidth) {
    expectWidth = options.maxWidth
    expectHeight = expectWidth / P
  } else if (naturalHeight > naturalWidth && naturalHeight > options.maxHeight) {
    expectHeight = options.maxHeight
    expectWidth = expectHeight * P
  }
  return {
    width: expectWidth,
    height: expectHeight
  }
}

//图片缩放
function imgScale(imgUrl, quality, cb) {
  let img = new Image();
  let canvas = document.createElement('canvas');
  let cxt = canvas.getContext('2d');
  img.src = imgUrl;
  img.onload = function() {
    //缩放后图片的宽高
    let width = img.naturalWidth / quality;
    let height = img.naturalHeight / quality;
    canvas.width = width;
    canvas.height = height;
    cxt.drawImage(this, 0, 0, width, height);
    let dataURL = canvas.toDataURL('image/jpeg');
    cb && cb(dataURL)
  }
}

//图片旋转
function rotateImg(img, direction, canvas) {
  var min_step = 0;
  var max_step = 3;
  if (img == null) return;
  var height = img.height;
  var width = img.width;
  var step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == 'right') {
    step++;
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  var degree = step * 90 * Math.PI / 180;
  var ctx = canvas.getContext('2d');
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
  }
}

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
