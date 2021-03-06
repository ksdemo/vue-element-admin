import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
import './mock'  // 该项目所有请求使用mockjs模拟
// 新增权限指令
import PermitFunc from '@/directive/permitFunc/index.js'
// 新增全局组件
import DialogFooterAdmin from '@/views/components/common/DialogFooterAdmin.vue'

Vue.use(ElementUI)
Vue.use(PermitFunc)
Vue.component('dialog-footer-admin', DialogFooterAdmin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
