import {AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_PASSWORD_ID, AUTH_PASSWORD_SECRET} from '@/config'
import fetch from '@/utils/fetch'
import {request, randomString, requestImg} from '@/utils/add.js'
import { getToken } from '@/utils/auth'
import md5 from 'js-md5';

/**
 * 客户端模式获取accessToken
 */
export function getClientToken() {
  const url = "/cms/oauth/token";
  var Authorization = 'Basic ' + window.btoa(AUTH_CLIENT_ID + ':' + AUTH_CLIENT_SECRET)
  var data = {grant_type: 'client_credentials'};
  var headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Authorization
  }
  return request({
    url,
    type: 'post',
    data,
    headers
  })
}

/*
 * 密码模式获取accessToken
 */
export function getPasswordToken(userInfo) {
  const url = "/cms/oauth/token";
  var Authorization = 'Basic ' + window.btoa(AUTH_PASSWORD_ID + ':' + AUTH_PASSWORD_SECRET)
  var headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Authorization
  }
  let password = md5(userInfo.password);
  var data = {
    grant_type: 'password',
    username: userInfo.username,// : 'admin',
    password,
    vcode: userInfo.vcode
    //: 'd525e685b8f0c89e5d981a6b86feb6d4'
  };
  console.log(data);
  return request({
    url,
    type: 'post',
    data,
    headers
  })
}

export function checkLoginType(username){
  return request({
    url: "/cms/sysLogin/checkLoginType",
    type: 'get',
    data: {
      username
    }
  })
}

export function getImgCode(){
  return requestImg({
    url: "/cms/sysLogin/getImgCode",
    type: 'get',
    data: {
      imgKey:  +new Date() + '_' + randomString(),
      access_token : getToken()
    }
  })
}

export function getPhoneCode(username){
  return request({
    url: "/cms/sysLogin/getSmsCode",
    type: 'get',
    data: {
      username:  username,
      access_token : getToken()
    }
  })
}

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return fetch({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

