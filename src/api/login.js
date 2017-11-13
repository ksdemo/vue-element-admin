import fetch from '@/utils/fetch'
import {request, randomString, requestImg} from '@/utils/add.js'
import { getToken } from '@/utils/auth'
import md5 from 'js-md5';

/**
 * 客户端模式获取accessToken
 */
export function getClientToken() {
  const url = "/cms/oauth/token";
  const CLIENT_ID = 'cms_client';
  const CLIENT_SECRET = '123456';
  var Authorization = 'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET)
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
  const PASSWORD_ID = 'cms_password'
  const PASSWORD_SECRET = '123456'
  var Authorization = 'Basic ' + window.btoa(PASSWORD_ID + ':' + PASSWORD_SECRET)
  var headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Authorization
  }
  let password = md5(userInfo.password);
  var data = {
    grant_type: 'password',
    username: userInfo.username,// : 'admin',
    password//: 'd525e685b8f0c89e5d981a6b86feb6d4'
  };
  console.log(userInfo);
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

