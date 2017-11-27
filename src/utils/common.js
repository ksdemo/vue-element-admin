import { Message } from 'element-ui'
// add
import {joinUrl, request as ajax} from '@/utils/ksutils/common/request.js'
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
  // options.requestType = 'xhr';
  return new Promise((resolve, reject)=>{
    ajax(options)
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
      Authorization
    }
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.timeout = 5000;
    for (var name in headers) {
      if (typeof headers[name] !== 'undefined' && headers.hasOwnProperty(name)) {
        xhr.setRequestHeader(name, headers[name])
      }
    }
    console.log(xhr)
    xhr.onload = function(e) {
      if (xhr.status == 200) {
          console.log(xhr.response)
          var blob = new Blob([xhr.response], {type: 'image/png'});
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
    }else{
      console.log("getRoleMenuChecked 的 rawData数据格式不合法")
    }
  }
}

// 扁平化
export function getRoleMenuFlatted(rawData){
  var data = {};
  flatten(rawData)
  return data;
  function flatten(_rawData){
    if(Array.isArray(_rawData)){
      _rawData.forEach((value) => {
        if(value.id){
          data[value.id] = value;
          if(Array.isArray(value.children) && value.children.length > 0){
            flatten(value.children)
          }
          if(value.children){
            delete value.children
          }
        }else {
          console.warn("getRoleMenuFlatted 的 rawData数据中: ", value, "无ID值")
        }
      })
    }else{
      console.warn("getRoleMenuFlatted 的 rawData数据格式不合法")
    }
  }
}

// permissiom judge
export function hasPermission(roles, menusFlatted, menuId) {
  if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  if (!menuId) return true
  if(menusFlatted[menuId]){
    return menusFlatted[menuId].checked
  }else{
    console.warn('本地文件配置了menuId: [' + menuId + '] 但服务端返回的数据不存在!!!')
    return false
  }
}
