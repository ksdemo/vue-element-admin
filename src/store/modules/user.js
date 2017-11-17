import { loginByUsername, logout, getUserInfo, getClientToken, getPasswordToken,checkLoginType, getImgCode, getPhoneCode} from '@/api/login'
import { getToken, setToken, setRefreshToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    loginType: 1,
    imgCode: null,
    adminPassword: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles || [];
    },
    SET_LOGINTYPE: (state, loginType) => {
      state.loginType = loginType
    },
    SET_IMGCODE: (state, imgCode) => {
      state.imgCode = imgCode
    },
    SET_ADMINPASSWORD: (state, adminPassword) => {
      state.adminPassword = adminPassword
    }
  },

  actions: {
    // 获取客户端token
    getClientToken({commit}) {
      return new Promise((resolve, reject) => {
        getClientToken()
        .then(response => {
          let token = response.data.access_token;
          setToken(token)
          commit('SET_TOKEN', token)
          resolve(token)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //获取用户登录类型
    checkLoginType({commit},username) {
      return new Promise((resolve, reject) => {
        checkLoginType(username)
        .then(response => {
          commit('SET_LOGINTYPE', response.loginType)
          resolve(response.loginType)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取验证码图片
    getImgCode({commit},param) {
      return new Promise((resolve, reject) => {
        getImgCode(param)
        .then(response => {
          commit('SET_IMGCODE', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取手机验证码
    getPhoneCode({commit},param) {
      return new Promise((resolve, reject) => {
        getPhoneCode(param)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取密码token
    getPasswordToken({commit}, userInfo) {
      userInfo.username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        getPasswordToken(userInfo).then(response => {
          const data = response.data || response
          let token = data.token || data.access_token;
          let refreshtoken = data.token || data.refresh_token;
          setToken(token)
          commit('SET_TOKEN', token)
          setRefreshToken(refreshtoken)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户名登录
    LoginByUsername({commit}, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          let token = data.token
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRole({commit}, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
