import {AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_PASSWORD_ID, AUTH_PASSWORD_SECRET} from '@/config'
import fetch from '@/utils/fetch'
import {request, randomString, requestImg} from '@/utils/common.js'
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
    method: 'post',
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
    username: userInfo.username,
    password
  };
  return request({
    url,
    method: 'post',
    data,
    headers
  })
}

// 获取登录方式
export function checkLoginType(username){
  return request({
    url: "/cms/sysLogin/checkLoginType",
    method: 'get',
    data: {
      username
    }
  })
}

// 获取验证码图片
export function getImgCode(params){
  return requestImg({
    url: "/cms/sysLogin/getImgCode",
    method: 'get',
    data: params
  })
}
// 获取手机验证码
export function getPhoneCode(username){
  return request({
    url: "/cms/sysLogin/getSmsCode",
    method: 'get',
    data: {
      username:  username,
      access_token : getToken()
    }
  })
}

// 验证码登录
export function loginByCode (loginInfo) {
  let data = {
    username: loginInfo.username,
    password: md5(loginInfo.password),
    code: loginInfo.code,
    imgKey: loginInfo.imgKey,
    loginType: loginInfo.loginType
  }
  return request({
    url: '/cms/sysLogin/sysLogin',
    method: 'post',
    data : data
  })
}


// 模拟数据, 登录
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

// 模拟数据 登出
export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  })
}

// 模拟 获取登录用户信息
export function getUserInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

