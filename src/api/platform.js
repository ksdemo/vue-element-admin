import fetch from '@/utils/fetch'
import {request} from '@/utils/add.js'
import md5 from 'js-md5';
/*
export function fetchList(query) {
  return request({
    url: '/article/list',
    type: 'get',
    data: query
  })
}
*/
export function fetchPlatformList(query) {
  return fetch({
    url: '/system/configs/platform/platform_list',
    method: 'get',
    params: query
  })
}

export function createPlatform(query) {
  return fetch({
    url: '/system/configs/platform/platform_list',
    method: 'get',
    params: query
  })
}

export function updatePlatform(query) {
  return fetch({
    url: '/system/configs/platform/platform_list',
    method: 'get',
    params: query
  })
}

export function modifyStatusPlatform(query) {
  return fetch({
    url: '/system/configs/platform/platform_list',
    method: 'get',
    params: query
  })
}

export function fetchArticle() {
  return fetch({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return fetch({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}