// 文件流/blob 转 base64
export function blobToBase64(blob, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function() {
    reader.onload = null
    cb(reader.result)
  }
}
// base64 转 blob
export function base64ToBlob(base64) {
  var arr = base64.split(','),
    mime = arr[0].match(/:(.*?);/)[1], //mime类型
    bstr = atob(arr[1]), // 解码base64数据为arraybuffer字符串,对应btoa为编码 ,https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/atob
    n = bstr.length, // 
    u8arr = new Uint8Array(n); //arraybuffer, 固定长度的缓冲对象
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
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
  return objectURL && URL.revokeObjectURL(objectURL)
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
