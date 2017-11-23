import { hasPermission } from '@/utils/common.js' // 验权, 注意,路由和按钮共用验权
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
  menusFlatted: state => state.user.menusFlatted,
  hasPermission:  (state) => (menuId) => {
    return hasPermission(state.user.roles, state.user.menusFlatted, menuId)
  }
}
export default getters
