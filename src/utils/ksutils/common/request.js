import { extend } from './common.js'

function getFormData(data) {
  var formData = new FormData()
  if (data.constructor !== Object) {
    throw new Error('getFormData 参数错误')
  }
  for (var key in data) {
    var value = data[key]
    if (data.hasOwnProperty(key) && typeof value !== 'undefined') {
      typeof value === 'object' && (value = JSON.stringify(value))
      formData.append(key, value)
    }
  }
  return formData
}

function joinUrlParam(data) {
  var str = '';
  if (data.constructor === Object) {
    for (var key in data) {
      var value = data[key];
      if (data.hasOwnProperty(key) && typeof value !== 'undefined') {
        typeof value === 'object' && (value = JSON.stringify(value))
        str += '&' + key + '=' + encodeURIComponent(value)
      }
    }
  }
  str = str.replace(/^\s+|^\&+|\s+$|\&+$/g, '')
  return str
}

function joinUrl(url, data) {
  url += /\?/.test(url) ? '&' : '?';
  return url + joinUrlParam(data)
}

export function ajax(option, callback) {
  var defaults = {
    //'get' | 'post'
    'type': 'GET',
    'async': true,
    'timeout': 30000,
    //string
    'url': '',
    //json
    'data': '',
    //type boolean,是否提供凭据(cookie、HTTP认证及客户端SSL证明等) 如果服务器接收带凭据的请求，会用下面的HTTP头部来响应。Access-Control-Allow-Credentials: true, 跨域时需特别设置
    'withCredentials': true,
    //json, 用于设置请求头,但无法设置cookie,host,referer,connection等敏感字段
    'headers': {
      'Accept': 'application/json, text/plain, */*',
      //post情况下必须配置 Content-Type, 其他可能值: 'application/json;charset=utf-8'
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    //value: 'json' | 'string'; return:  json | string
    'dataType': 'json',
    //function; return:  string | json
    'success': '',
    //function; return:  xhr.status
    'error': '',
    //function; return:  [success: string | json ] | [error: undefined]
    'complete': '',
    // 返回数据类型, 空字符串 (默认), "arraybuffer", "blob", "document", 和 "text"
    'responseType': ''
  }
  option = extend(true, {}, defaults, option)
  var xhr = XMLHttpRequest ? new XMLHttpRequest() : XDomainRequest ? new XDomainRequest() : new ActiveXObject('Microsoft.XMLHttp') // XDomainRequest IE8+优先使用
  var type = option.type.toUpperCase(),
    url = option.url,
    data = option.data,
    headers = option.headers,
    success = option.success,
    error = option.error,
    dataType = option.dataType,
    complete = option.complete;
  //GET 需拼接url字符串
  if (type === 'GET') {
    url = joinUrl(url, data)
  }
  xhr.open(type, url, option.async)
  xhr.timeout = option.timeout // 设置超时
  xhr.withCredentials = option.withCredentials
  xhr.responseType = option.responseType 
  if (type === 'POST') {
    data = joinUrlParam(data)
      // POST 需设请求头
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
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
            switch (dataType) {
              case 'text':
                res = xhr.responseText;
                break;
              case 'json':
                res = JSON.parse(xhr.responseText);
                break;
              case 'xml':
                if (xhr.responseXML && xhr.responseXML.documentElement) {
                  res = xhr.responseXML.documentElement
                } else {
                  throw new Error('AJAX_CONNCTION_ERROR_XML')
                }
                break;
              case 'image':
                res = res;
                break;
            }
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

export function jsonp(option, callback) {
  var defaults = {
    'url': '',
    'data': {}, // 必须为json,后期使用
    'dataType': 'json',
    'jsonp': 'callback', // 后端定义的接收回调函数名的key,默认为callback;如后台指定需更改此参数
    'jsonpCallback': 'jsonp_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2) // 前端回调执行的函数名,默认为随机数;如后台指定需更改此参数 //jsonp不会发送错误回调
  }
  option = extend({}, defaults, option)
  option.data[option.jsonp] = option.jsonpCallback; //前端定义函数jsonp_xxx = function(res){callback(res)}, 传给后端 callback = 'jsonp_xxx', 后端传回 jsonp_xxx(res)执行在全局作用域下,
  var script = document.createElement('script')
  script.src = joinUrl(option.url, option.data)
  script.type = 'text/javascript'
    // 定义回调函数
  window[option.jsonpCallback] = window[option.jsonpCallback] || function(res) {
      // 执行后销毁
      window[option.jsonpCallback] = undefined
      script.parentNode && script.parentNode.removeChild(script)
      script = null
        // 执行回调
      option.dataType === 'json' && (res = JSON.parse(res))
      callback && callback(res)
    }
    // 添加到dom中;
  document.body.appendChild(script)
}

export async function request({ 
  url = '', 
  data = {}, 
  dataType = 'json', 
  type = 'GET', 
  method = 'fetch',
  responseType = '',
  headers = {
    'Accept': 'application/json, text/plain, */*',// 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'//'application/json'
  }
}) {
  type = type.toUpperCase();

  if(type == 'GET') {
    url = joinUrl(url, data)
  }
  if(window.fetch && method == 'fetch') {
    let requestConfig = {
      // cookie
      credentials: 'include',
      method: type,
      headers,
      mode: "cors",
      responseType,
      cache: "force-cache"
    }

    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: joinUrlParam(data) //JSON.stringify(data)
      })
    }

    try {
      let response = await fetch(url, requestConfig);
      if(dataType == 'json'){
        response = await response.json();
      }else {
        response = response.body
      }
      return response
    } catch (e) {
      throw new Error(e)
    }
  } else {
    return new Promise((resolve, reject) => {
      ajax({
        url,
        type,
        data,
        dataType,
        headers,
        success: resolve,
        error: reject
      })
    })
  }
}
