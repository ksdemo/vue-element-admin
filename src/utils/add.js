import { Message } from 'element-ui'
// add
import {ajax, request as ajax2} from '@/utils/ksutils/common/request.js'
import {compareObj} from '@/utils/ksutils/common/common.js'
import { getToken } from '@/utils/auth'

export {compareObj}

export function request(options){
  const BASE_API = process.env.BASE_API
  options.url = BASE_API + options.url

  if(!options.headers){
    let Authorization = 'Bearer ' + getToken();
    let headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization
    }
    options.headers = headers;
  }
  return new Promise((resolve, reject)=>{
    ajax2(options)
      .then(res =>{
        if(res.code == 0 ){
          resolve(res)
        }else{
          Message({
            message: res.message,
            type: 'error',
            duration: 5 * 1000
          })
          reject(res.msg)
        }
      })
      .catch(err =>{
        let errMsg = '服务器连接错误';
        Message({
          message: errMsg,
          type: 'error',
          duration: 5 * 1000
        })
        reject(errMsg)
      })

  })
}

export function requestImg(options){
  return new Promise((resolve, reject)=>{
    const BASE_API = process.env.BASE_API
    var url = BASE_API + options.url;
    url = joinUrl(url, options.data);
    resolve(url)
    /*
    var Authorization = 'Bearer ' + getToken();
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization
    }
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "arraybuffer";
    xhr.timeout = 5000;
    for (var name in headers) {
      if (typeof headers[name] !== 'undefined' && headers.hasOwnProperty(name)) {
        xhr.setRequestHeader(name, headers[name])
      }
    }
    xhr.onload = function(res) {
      if (this.status == 200) {
          console.log(res)
          var data = this.response
          console.log(data)
          var blob = new Blob([data], {
              type: 'image/jpeg'
          })
          console.log(blob)
          var read = new FileReader() // 新建一个读取文件对象
          read.readAsDataURL(blob) // 读取文件
          read.onload = function() { // 读取成功后回调
            read.onload = null
            var imgCode = window.URL.createObjectURL(blob);
            console.log(imgCode)
            console.log(read.result)
            resolve(imgCode)
          }

      }else{
        reject('获取验证图片失败')
      }
    }
    xhr.ontimeout = function() {
      xhr.onload = null
      reject('获取验证图片超时')
    }
    xhr.send();
    /**/
  })
}

// 随机字符串
export function randomString(len) {
    len = len || 6;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    var maxPos = $chars.length;
    var ranstr = '';
    for (var i = 0; i < len; i++) {
        ranstr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return ranstr;
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

export function deepCloneJSON(obj){
  return JSON.parse(JSON.stringify(obj))
}


export function transformRoleMenu(rawData,isFunc){
  if(Array.isArray(rawData)){
    var data = [];
    rawData.forEach((value,index) => {
      var obj = {};
      if(isFunc){
        obj.id = value.funcId;
        obj.parentId = value.menuId
        obj.isLeaf = true
        obj.isFunc = true
        obj.label = value.name
        obj.checked = value.checkbox
        obj.code = value.code
      }else{
        obj.id = value.menuId;
        obj.parentId = value.parentId
        obj.label = value.name
        obj.checked = value.checkbox
        obj.code = value.url
        obj.children = []
        if(Array.isArray(value.menus) && value.menus.length> 0){
          let _data = transformRoleMenu(value.menus)
          obj.children = obj.children.concat(_data)
        }
        if(Array.isArray(value.funcs) && value.funcs.length> 0){
          let _data = transformRoleMenu(value.funcs, true)
          obj.children = obj.children.concat(_data)
        }
        if(obj.children.length == 0){
          obj.isLeaf = true
          delete obj.children
        }
      }
      data.push(obj)
    })
    return data
  }else{
    console.log("menuData数据格式不合法")
    return []
  }
}
// 获取选中的id值
export function getRoleMenuChecked(rawData){
  var data = [];
  getChecked(rawData)
  return data;
  function getChecked(_rawData){
    if(Array.isArray(_rawData)){
      _rawData.forEach((value,index) => {
        if(value.checked){
          data.push(value.id);
        }
        if(Array.isArray(value.children) && value.children.length> 0){
          getChecked(value.children)
        }
      })
      return data
    }else{
      console.log("getRoleMenuChecked 的 rawData数据格式不合法")
      return []
    }
  }
}

