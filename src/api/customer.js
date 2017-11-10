import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchInfo() {
  return fetch({
    url: '/customer/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return fetch({
    url: '/customer/pv',
    method: 'get',
    params: { pv }
  })
}

