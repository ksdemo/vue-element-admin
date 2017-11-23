import permitFunc from './permitFunc'

const install = function(Vue) {
  Vue.directive('permitFunc', permitFunc)
}

if (window.Vue) {
  window.permitFunc = permitFunc
  Vue.use(install); // eslint-disable-line
}

permitFunc.install = install
export default permitFunc
