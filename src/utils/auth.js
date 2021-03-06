import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const ClientTokenKey = 'Client-Token'

const RefreshTokenKey = 'Refresh-Token'

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setClientToken(token) {
  return Cookies.set(ClientTokenKey, token)
}

export function getClientToken() {
  return Cookies.get(ClientTokenKey)
}

export function removeClientToken() {
  return Cookies.remove(ClientTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function getRefreshToken(token) {
  return Cookies.get(RefreshTokenKey)
}

export function removeRefreshToken(token) {
  return Cookies.remove(RefreshTokenKey)
}