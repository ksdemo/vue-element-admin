import fetch from '@/utils/fetch'
import {request} from '@/utils/index.js'
/**
 * 客户端模式获取accessToken

export function getClientToken: function () {
  var deferred = $q.defer();
  var method = "auth/oauth/token";
  var params = {grant_type: 'client_credentials'};
  var postCfg = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + CLIENT_AUTH
      },
      transformRequest: function (params) {
          return $.param(params);
      }
  };
  $http.post(REQUEST_URL + method, params, postCfg).then(function (res) {
      if (res.data.access_token) {
          util.setDataToLocalStorage(ACCESS_TOKEN, res.data.access_token, 1);
      }
      deferred.resolve(res.data);
  }).catch(function (res) {
      deferred.reject(res.data);
  });
  return deferred.promise;
}
 */
/**
 * 密码模式获取accessToken
 */


function loginByUsername1(username, password) {
  var data = {
    grant_type: 'password',
    username: 'oauth2:user:102:1',
    password: 'e10adc3949ba59abbe56e057f20f883e'
  };

  return request({
    url: "/cms/oauth/token",
    type: 'post',
    data
  })
}

function loginByUsername2(username, password) {
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

let loginByUsername = loginByUsername2
export {loginByUsername}

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

