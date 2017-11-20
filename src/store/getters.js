function isHidden(route) {
  if (route.meta && route.meta.hidden) {
    return true
  } else {
    return false
  }
}

function filterMenuRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (!isHidden(route)) {
      if (route.children && route.children.length) {
        route.children = filterMenuRouter(route.children)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menuRouters: state => filterMenuRouter(state.permission.routers)
}
export default getters
