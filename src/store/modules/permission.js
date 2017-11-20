import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menus, route) {
  if (route.meta && route.meta.menuId) {
    return menus.indexOf(route.meta.menuId) >= 0
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
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
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles, menus } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
