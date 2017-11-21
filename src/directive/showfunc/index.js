import showfunc from './showfunc'

const install = function(Vue) {
  Vue.directive('showfunc', showfunc)
}

if (window.Vue) {
  window.showfunc = showfunc
  Vue.use(install); // eslint-disable-line
}

showfunc.install = install
export default showfunc
