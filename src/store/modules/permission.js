import { asyncRouterMap, constantRouterMap } from '@/router'
import { hasPermission } from '@/utils/common.js' // 验权

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(roles, menus, asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, menus, route.meta && route.meta.menuId)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(roles, menus, route.children)
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
    GenerateRoutes({ state, commit, rootState }) {
      return new Promise(resolve => {
        const roles = rootState.user.roles
        const menus = rootState.user.menus
        console.log(roles, menus)
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(roles, menus, asyncRouterMap)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
