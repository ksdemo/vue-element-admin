import permitFunc from './permitFunc.js'

const PermitFunc = {};

PermitFunc.install = function(Vue) {
  Vue.directive('permit-func', permitFunc)
}

export default PermitFunc
