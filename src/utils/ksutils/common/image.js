import EXIF from '../lib/exif-js/exif.js' //EXIF
import { isMobileUserAgent } from './common.js'
import { splitBase64,getBase64Size, blobToBase64, createObjectURL, revokeObjectURL } from './transcode.js'

// 检测图片是否合法
export function valiImg(file){
  if(!file){
    return false
  }
  var type = file.type;
  var arr = file.type.match(/^image\/(jpeg|jpg|gif|png|bmp)$/i)
  if(!arr){
    alert('请上传合法图片类型!')
    return false
  }
  return type
}

// 创建结果
export function createResult(canvas, options){
  var base64 = canvas.toDataURL(options.mime);
  var splited = splitBase64(base64)
  var size= getBase64Size(base64)
  var result = {
    filename: options.filename,
    base64: base64,
    width: canvas.width,
    height: canvas.height,
    str: splited.str,
    mime: splited.mime,
    suffix: splited.mime.replace('image/', ''),
    size: size
  }
  return result
}

// 主函数
export function imgReader(file, options, cb) {
  var mime = valiImg(file)
  if (!mime) return;
  // 移动端
  options.width = options.width || '';
  options.height = options.height || '';
  options.maxWidth = options.maxWidth || 800;
  options.maxHeight = options.maxHeight || 1200;
  options.maxSize = options.maxSize || 1024 * 1e3; // 1M, 单位kb
  options.filename = options.filename || file.name;

  blobToBase64(file, function(base64) {
    options.mime = options.mime || splitBase64(base64).mime // 指定图片类型
    var image = document.createElement("img");
    image.src = base64;
    image.onload = function() {

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      
      // resize
      var expectRect = getExpectRect(this, options)
      canvas.width = expectRect.width;
      canvas.height = expectRect.height;
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

      //修复ios上传图片的时候 被旋转的问题
      if (isMobileUserAgent() === 'ipad' || isMobileUserAgent() === 'iphone') {
        drawImageIOSFix(image, file, canvas)
      }
      // 读取数据
      cb && cb(createResult(canvas, options))

    };
  })
}


// 获取缩放宽高
export function getExpectRect(img, options) {
  var naturalWidth = img.naturalWidth;
  var naturalHeight = img.naturalHeight;
  var expectWidth = img.naturalWidth;
  var expectHeight = img.naturalHeight;
  var P = naturalWidth / naturalHeight;

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
export function imgScale(imgSrc, scale, mime, cb) {
  let img = document.createElement("img");
  let canvas = document.createElement('canvas');
  let cxt = canvas.getContext('2d');
  img.src = imgSrc;
  img.onload = function() {
    //缩放后图片的宽高
    let width = img.naturalWidth / scale;
    let height = img.naturalHeight / scale;
    canvas.width = width;
    canvas.height = height;
    cxt.drawImage(this, 0, 0, width, height);
    cb && cb(canvas)
  }
}

//修复ios上传图片的时候 被旋转的问题
export function drawImageIOSFix(img, file, canvas) {
  let Orientation
  EXIF.getData(file, function() {
    Orientation = EXIF.getTag(file, 'Orientation');
  });
  if (Orientation != "" && Orientation != 1) {
    switch (Orientation) {
      case 6: //需要顺时针（向左）90度旋转
        rotateImg(img, 'left', canvas);
        break;
      case 8: //需要逆时针（向右）90度旋转
        rotateImg(img, 'right', canvas);
        break;
      case 3: //需要180度旋转
        rotateImg(img, 'right', canvas); //转两次
        rotateImg(img, 'right', canvas);
        break;
    }
  }
}

//图片旋转
export function rotateImg(img, direction, canvas) {
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
        var objectURL = createObjectURL(file)
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
              revokeObjectURL(objectURL)
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
