import { extend } from './common.js'
import { jsonToFormdata, jsonToUrl, jsonToXml, xmlToJson } from './transcode.js'

const defaultOptions = {
  //'get' | 'post'
  'method': 'GET',
  // 异步
  'async': true,
  // 超时 毫秒
  'timeout': 10000,
  //string
  'url': '',
  //json
  'data': '',
  // boolean,是否提供凭据(cookie、HTTP认证及客户端SSL证明等) 如果服务器接收带凭据的请求，会用下面的HTTP头部来响应。Access-Control-Allow-Credentials: true, 跨域时需特别设置
  'withCredentials': true,
  //json, 用于设置请求头,但无法设置cookie,host,referer,connection等敏感字段
  'headers': {
    'Accept': 'application/json, text/plain, */*'
  },
  //value: 'urlencoded' | 'json' | 'string'; return:  json | string
  // 同jquery指接收数据类型不同, 此处指发送数据类型,同时设置对应头部
  'dataType': 'urlencoded',
  // 成功回调; return:  string | json
  'success': function() {},
  // 错误回调; return:  xhr.status
  'error': function() {},
  // 完结回调; return:  [success: string | json ] | [error: undefined]
  'complete': function() {},
  // 返回数据类型, 空字符串 (默认), "text" ,"json", "arraybuffer", "blob", "document" 参考:  https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
  'responseType': 'json',
  'requestType': 'fetch'
}

function cloneJson(json) {
  return JSON.parse(JSON.stringify(json))
}

export function joinUrl(url, data) {
  url += /\?/.test(url) ? '&' : '?';
  return url + jsonToUrl(data)
}

// 根据dataType设置 data 和 header的ContentType
// https://segmentfault.com/a/1190000004982390
export function setPostContent(data, dataType, headers) {
  switch (dataType) {
    case 'json':
      data = JSON.stringify(data);
      headers['Content-Type'] = 'application/json;charset=utf-8';
      break;
    case 'formData':
      data = jsonToFormdata(data);
      delete headers['Content-Type'];
      break;
    case 'xml':
      data = jsonToXml(data);
      delete headers['Content-Type'];
      break;
    case 'text':
      data = data;
      if (typeof data !== 'string') {
        console.warn('text发送数据类型应为字符串')
      }
      headers['Content-Type'] = 'text/plain';
      break;
    // 默认使用  urlencoded 键值对格式
    case 'urlencoded':
    default:
      data = jsonToUrl(data);
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      break;
  }
  return data
}

export function getXhrData(xhr, responseType) {
  var resData;
  responseType = responseType || xhr.responseType
  switch (responseType) {
    // DOMString
    case 'text':
      resData = xhr.responseText;
      break;
    case 'json':
      resData = xhr.responseText
      if (typeof resData === 'string') {
        console.log(xhr, 1)
        resData = JSON.parse(resData);
      } else if (typeof resData === 'object') {
        console.log(xhr, 2)
        resData = resData;
      } else {
        console.warn("json resData 数据格式错误")
      }
      break;
    // xml 等 dom 对象
    case 'document':
      if (xhr.responseXML && xhr.responseXML.documentElement) {
        resData = xmlToJson(xhr.responseXML.documentElement)
      } else {
        throw new Error('AJAX_CONNECTION_ERROR_XML')
      }
      break;
    //blob 二进制数据
    case 'blob':
      resData = xhr.response;
    // var blob = new Blob([resData], {type: 'image/png'});
    //arraybuffer 二进制数据
    case 'arraybuffer':
      resData = xhr.response;
      // var byteArray = new Uint8Array(resData);
      break;
  }
  return resData
}

export function ajax(options, callback) {
  options = extend(cloneJson(defaultOptions), options)
  var xhr = XMLHttpRequest ? new XMLHttpRequest() : XDomainRequest ? new XDomainRequest() : new ActiveXObject('Microsoft.XMLHttp') // XDomainRequest IE8+优先使用
  var method = options.method.toUpperCase(),
    url = options.url,
    data = options.data,
    headers = options.headers,
    success = options.success,
    error = options.error,
    dataType = options.dataType,
    complete = options.complete;
  //GET 需拼接url字符串
  if (method === 'GET') {
    url = joinUrl(url, data)
  }
  xhr.open(method, url, options.async)
  xhr.timeout = options.timeout // 设置超时
  xhr.withCredentials = options.withCredentials
  xhr.responseType = options.responseType
  // 根据 Content-Type 头设置 data格式 https://segmentfault.com/a/1190000004982390
  if (method !== 'GET') {
    data = setPostContent(data, dataType, headers)
  }
  for (var name in headers) {
    if (typeof headers[name] !== 'undefined' && headers.hasOwnProperty(name)) {
      xhr.setRequestHeader(name, headers[name])
    }
  }
  xhr.ontimeout = function() {
    error && error('AJAX_CONNCTION_ERROR_TIMEOUT', xhr)
    complete && complete(null, xhr)
    callback && callback(null, xhr)
    xhr.onreadystatechange = null
  }

  xhr.onreadystatechange = function() {
    var res
    if (xhr.readyState == 4) {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          res = getXhrData(xhr, options.responseType)
          success && success(res, xhr);
        } else {
          throw new Error('AJAX_CONNCTION_ERROR_STATUS :' + xhr.status)
        }
      } catch (e) {
        res = null
        error && error(e, xhr)
      }
      complete && complete(res, xhr)
      callback && callback(res, xhr)
      xhr.ontimeout = null
    }
  }
  // fix: ie8 status error
  // window.XDomainRequest && (xhr.readyState = 2)
  xhr.send(data)
  return xhr
}

export function jsonp(options, callback) {
  var defaults = {
    'url': '',
    'data': {}, // 必须为json,后期使用
    'responseType': 'json',
    'jsonp': 'callback', // 后端定义的接收回调函数名的key,默认为callback;如后台指定需更改此参数
    'jsonpCallback': 'jsonp_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2) // 前端回调执行的函数名,默认为随机数;如后台指定需更改此参数 //jsonp不会发送错误回调
  }
  options = extend({}, defaults, options)
  options.data[options.jsonp] = options.jsonpCallback; //前端定义函数jsonp_xxx = function(res){callback(res)}, 传给后端 callback = 'jsonp_xxx', 后端传回 jsonp_xxx(res)执行在全局作用域下,
  var script = document.createElement('script')
  script.src = joinUrl(options.url, options.data)
  script.type = 'text/javascript'
  // 定义回调函数
  window[options.jsonpCallback] = window[options.jsonpCallback] || function(res) {
    // 执行后销毁
    window[options.jsonpCallback] = undefined
    script.parentNode && script.parentNode.removeChild(script)
    script = null
    // 执行回调
    options.responseType === 'json' && (res = JSON.parse(res))
    callback && callback(res)
  }
  // 添加到dom中;
  document.body.appendChild(script)
}

// https://developer.mozilla.org/en-US/docs/Web/API/Body/json
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
export async function fetchData(options) {
  if (!window.fetch) {
    console.error('window.fetch 方法不存在')
    return null
  }
  options = extend(cloneJson(defaultOptions), options)
  let url = options.url
  let data = options.data
  let method = options.method.toUpperCase();
  if (method == 'GET') {
    url = joinUrl(url, data)
  }

  let requestConfig = {
    // cookie
    credentials: 'include',
    method: method,
    headers: options.headers,
    mode: "cors",
    responseType: options.responseType,
    cache: "force-cache"
  }

  if (method === 'POST') {
    data = setPostContent(data, options.dataType, requestConfig.headers)
    Object.defineProperty(requestConfig, 'body', {
      value: data
    })
  }

  try {
    let response = await fetch(url, requestConfig);
    switch (options.responseType) {
      case 'text':
        response = await response.text();
        break;
      case 'json':
        response = await response.json();
        break;
      case 'formData':
        response = await response.formData();
        break;
      case 'blob':
        response = await response.blob();
        break;
      case 'arrayBuffer':
        response = await response.arrayBuffer();
        break;
      default:
        response = response.body
        break
    }
    return response
  } catch (e) {
    throw new Error(e)
  }
}

export async function request(options) {
  options = extend(cloneJson(defaultOptions), options)
  if (window.fetch && options.requestType == 'fetch') {
    return await fetchData(options)
  } else if (options.requestType === 'xhr') {
    return new Promise((resolve, reject) => {
      options.success = resolve;
      options.error = reject;
      ajax(options)
    })
  } else {
    console.error("request options requestType 不合法")
    return null;
  }
}
