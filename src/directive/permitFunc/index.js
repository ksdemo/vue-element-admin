import permitFunc from './permitFunc.js'

const PermitFunc = {};

const install = function(Vue) {
  Vue.directive('permit-func', permitFunc)
}

PermitFunc.install = install
export default PermitFunc
