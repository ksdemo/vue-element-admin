import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, getters) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (getters.hasPermission(route.meta && route.meta.menuId)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, getters)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 递归过滤符合用户角色权限的路由表，返回需显示为左侧菜单的路由表
 * @param asyncRouterMap
 * @param roles
 */

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUROUTERS: (state, routers) => {
      state.menuRouters = routers
    }
  },
  actions: {
    GenerateRoutes({ commit, getters }) {
      return new Promise(resolve => {
        const roles = getters.roles
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, getters)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
