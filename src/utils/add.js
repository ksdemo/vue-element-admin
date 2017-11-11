import { Message } from 'element-ui'
// add
import {request as ajax} from '@/utils/ksutils/common/request.js'
import { getToken } from '@/utils/auth'

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
    ajax(options)
      .then(res =>{
        if(res.code === 0 || 1){
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

// 随机字符串
export function randomString(len) {
    var len = len || 61;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    var maxPos = $chars.length;
    var ranstr = '';
    for (var i = 0; i < len; i++) {
        ranstr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return ranstr;
}