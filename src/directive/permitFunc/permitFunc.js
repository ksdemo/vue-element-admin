/* 根据权限是否显示按钮 */

export default{
  bind(el, binding, vnode) {
    const id = binding.value;
    const getters = vnode.context.$store.getters
    var hasPermission = getters.hasPermission(id)
    if(!hasPermission){
      el.parentNode.removeChild(el)
    }else{
      var item = getters.menusFlatted[id]
      if(item){
        el.innerHTML = '<span>'+ item.label +'</span>'
      }
    }
  }
}