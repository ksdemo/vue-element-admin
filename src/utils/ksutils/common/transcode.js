// 文件流/blob 转 base64
export function blobToBase64(blob, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function() {
    reader.onload = null
    cb(reader.result)
  }
}

// string 转 Uint8 arraybuffer
export function strToU8arr(str){
  var n = str.length,
      u8arr = new Uint8Array(n); //Uint8类型的arraybuffer, 固定长度的缓冲对象
  while (n--) {
    u8arr[n] = str.charCodeAt(n);
  }
  return u8arr
}

// 分离 base64图片编码的头部和数据部分
export function splitBase64(base64){
  var arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1], //mime类型
      str = arr[1];
  return {
    str,
    mime
  }
}

// 获取base64的文件大小
export function getBase64Size(base64) {
  let str = splitBase64(base64).str;
  var equalIndex= str.indexOf('=');
  if(str.indexOf('=')>0){
      str=str.substring(0, equalIndex);
  }
  var strLength=str.length;
  var fileLength=parseInt(strLength-(strLength/8)*2);
  return fileLength
}


// base64 转 blob
export function base64ToBlob(base64) {
  var splited = splitBase64(base64),
      bstr = atob(splited.str), // 解码base64,https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/atob
      u8arr = strToU8arr(bstr);

  return new Blob([u8arr], {
    type: splited.mime
  });
}


//utf8 转  base64
export function utf8Tobase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// base64 转 utf8
export function base64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

// 文件流/blob 转 ObjectURL
export function createObjectURL(blob) {
  let URL = window.URL || window.webkitURL || window.mozURL || window.msURL
  return URL.createObjectURL(blob)
}

// 释放 ObjectURL 资源
export function revokeObjectURL(objectURL) {
  let URL = window.URL || window.webkitURL || window.mozURL || window.msURL
  try{
    URL.revokeObjectURL(objectURL)
  }catch(e){
    console.warn(e)
  }
}


export function jsonToFormdata(json) {
  var formData = new FormData()
  if (typeof json !== 'object') {
    throw new Error('jsonToFormdata 参数错误')
  }
  for (var key in json) {
    var value = json[key]
    if (json.hasOwnProperty(key) && typeof value !== 'undefined') {
      typeof value === 'object' && (value = JSON.stringify(value))
      formData.append(key, value)
    }
  }
  return formData
}

export function jsonToUrl(json) {
  if (typeof json !== 'object') {
    throw new Error('jsonToUrl 参数错误')
  }
  var str = '';
  if (typeof json === 'object') {
    for (var key in json) {
      var value = json[key];
      if (json.hasOwnProperty(key) && typeof value !== 'undefined') {
        typeof value === 'object' && (value = JSON.stringify(value))
        str += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value)
      }
    }
  }
  str = str.replace(/^\s+|^\&+|\s+$|\&+$/g, '')
  return str
}

export function jsonToXml(json) {
  if (typeof json !== 'object') {
    throw new Error('jsonToXml 参数错误')
  }
  var dataToSend = document.implementation.createDocument("", "formdata", null);
  var tempData = dataToSend.documentElement;
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      var keyElement = document.createElement(key);
      keyElement.appendChild(document.createTextNode(json[key]));
      tempData.appendChild(keyElement);
    }
  }
  return dataToSend
}

export function xmlToJson(xml) {
  if (typeof xml !== 'object') {
    throw new Error('xmlToJson 参数错误')
  }
  // 转换 待补充
  return xml
}
