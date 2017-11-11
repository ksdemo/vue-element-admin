'use strict'
/**
 * 1. 字符串
 * 2. 数字
 * 3. 函数
 * 4. 数组
 * 5. 对象
 * 10.环境
 */

/*  1. 字符串 S **/
export function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, '')
}

/*  1. 字符串 S **/
/*  2. 数字 S */
/*  2. 数字 E */
/*  3. 函数处理 S */
/*
 * 频率控制 和 空闲控制
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 * 参数效果:
 * immediate  true : 总是delay再执行,
 * debounce   true : 两次触发的间隔必须大于delay才会执行,
 * true, true  连续触发时,小于delay不会连续执行,只执行停止触发时的最后一次;
 * false, true 连续触发时,小于delay不会连续执行,只执行初始触发第一/二次;
 * true, false 连续触发时,会按照delay间隔连续执行;触发次数会比 false false 多;
 * false, false 连续触发时,会按照delay间隔连续执行;
 */
export function throttle(fn, delay, immediate, debounce) {
  var curr = +new Date(), // 当前事件
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff, // 时间差
    context, // 上下文
    args,
    exec = function() {
      last_exec = curr
      fn.apply(context, args)
  }
  return function() {
    curr = +new Date()
    context = this
    args = arguments
    diff = curr - (debounce ? last_call : last_exec) - delay
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    last_call = curr
  }
}
export function debounce(fn, delay, immediate) {
  return throttle(fn, delay, immediate, true)
}
export function lazy(fn, delay) {
  return throttle(fn, delay, true, true)
}
/*  3. 函数处理 E */
/*  4. 数组 S  */
export function isArray(obj) {
  if (typeof obj === 'object' && obj.constructor === Array) {
    return true
  }
  return false
}
export function inArray(param, array) {
  for (var i = 0, iL = array.length; i < iL; i++) {
    if (param === array[i]) {
      return true
    }
  }
  return false
}
export function toArray(arrayLike) {
  return [].slice.call(arrayLike)
}
/*  4. 数组 E  */
/*  5. 对象 S */
export function inObj(param, obj) {
  for (var i in obj) {
    if (typeof obj[i] !== 'undefined' && obj.hasOwnProperty(i) && param === obj[i]) {
      return true
    }
  }
  return false
}


// 扩展 克隆 摘取自jquery
export function extend() {

  var toString = Object.prototype.toString
  var getProto = Object.getPrototypeOf
  var hasOwn = Object.prototype.hasOwnProperty
  var fnToString = hasOwn.toString

  function isPlainObject(obj) {
    var proto, Ctor

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false
    }

    proto = getProto(obj)

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
      return true
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
    return typeof Ctor === 'function' && fnToString.call(Ctor) === fnToString.call(Object)
  }

  /*
   *target被扩展的对象
   *length参数的数量
   *deep是否深度操作
   */
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false

  // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
  // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
  // 然后把第二个参数赋值给target
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {}
    // 将i赋值为2，跳过前两个参数
    i = 2
  }

  // target既不是对象也不是函数则把target设置为空对象。
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }

  // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
  if ( length === i ) {
      target = this;
      // i减1，指向被扩展对象
      --i;
  }

  // 开始遍历需要被扩展到target上的参数
  for (; i < length; i++) {
    // 处理第i个被扩展的对象，即除去deep和target之外的对象
    if ((options = arguments[i]) != null) {
      // 遍历第i个对象的所有可遍历的属性
      for (name in options) {
        // 根据被扩展对象的键获得目标对象相应值，并赋值给src
        src = target[name]
        // 得到被扩展对象的值
        copy = options[name]

        // 防止 target 被引用导致无限递归
        if (target === copy) {
          continue
        }

        // 当用户想要深度操作时，递归合并
        // copy是纯对象或者是数组
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          // 如果是数组
          if (copyIsArray) {
            // 将copyIsArray重新设置为false，为下次遍历做准备。
            copyIsArray = false
            // 判断被扩展的对象中src是不是数组
            clone = src && isArray(src) ? src : []
          } else {
            // 判断被扩展的对象中src是不是纯对象
            clone = src && isPlainObject(src) ? src : {}
          }

          // 递归调用extend方法，继续进行深度遍历
          target[name] = extend(deep, clone, copy)

        // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  // 原对象被改变，因此如果不想改变原对象，target可传入{}
  return target
}


/*  5. 对象 E  */
/*  7. url S  */
/**
 * [description]
 * @param  {[string]} name [变量名]
 * @param  {[string]} type [取址类型 search | hash ]
 * @return {[string]}      [变量值]
 */
export function getUrlParam(name, type) {
  var str
  if (type === 'hash') {
    str = window.location.hash
  } else if (type === 'href') {
    str = window.location.href
  } else {
    str = window.location.search
  }
  var result = str.substr(1).match(new RegExp('(^|&|\\?)' + name + '=([^&$]*)', 'i'))
  return result ? decodeURIComponent(result[2]) : null;
}

export function getCookie(name) {
  var cookieStr = ';' + document.cookie + ';'
  var index = cookieStr.indexOf(';' + name + '=')
  if (index != -1) {
    var s = cookieStr.substring(index + name.length + 3, cookieStr.length)
    return decodeURIComponent(s.substring(0, s.indexOf(';')))
  } else {
    return null
  }
}
export function setCookie(name, value, expires) {
  var expDays = expires * 24 * 60 * 60 * 1000
  var expDate = new Date()
  expDate.setTime(expDate.getTime() + expDays)
  var expString = expires ? ';expires=' + expDate.toGMTString() : ''
  var pathString = ';path=/'
  document.cookie = name + '=' + encodeURIComponent(value) + expString + pathString
}
export function delCookie(name, value, expires) {
  var exp = new Date(new Date().getTime() - 1)
  var s = getCookie(name)
  if (s != null) {
    document.cookie = name + '=' + s + ';expires=' + exp.toGMTString() + ';path=/'
  }
}
/*
 * [description]
 * @param  {[string]} tpl    [模板字符串] eg: '<li>{title} : {text} <span>加工的 { text }</span></li>'
 * @param  {[array | object]} data   [数据] eg: [{title : '标题一', text: '内容一'},{title : '标题二', text: '内容二'}]
 * @param  {[element]} parent [父原生dom节点]
 * @return {[type]}        [description]
 */
export function template(tpl, data) {
  var result = ''
  if (data instanceof Array) {
    for (var i = 0, iL = data.length; i < iL; i++) {
      result += replace(tpl, data[i])
    }
  } else if (data && typeof data === 'object') {
    result = replace(tpl, data)
  } else {
    throw new Error('template编译data错误')
  }

  function replace(tpl, data) {
    return tpl.replace(/\{\s*(\w+)\s*\}/g, function(match, key) {
      return data[key] || data[key] === 0 ? data[key].toString() : ''
    })
  }
  return result
}
/*  9. dom E */
/* 10 环境 S */
export function isMobileUserAgent() {
  var userAgent = navigator.userAgent.toLowerCase(),
    agents = {
      'ipad': 'ipad',
      'iphone': 'iphone os',
      'Uc7': 'rv:1.2.3.4',
      'ucweb': 'ucweb',
      'android': 'android',
      'windows ce': 'windows ce',
      'windows mobile': 'windows mobile',
      'webview': 'webview'
  }
  for (var name in agents) {
    if (typeof agents[name] !== 'undefined' && agents.hasOwnProperty(name)) {
      if (new RegExp(agents[name], 'i').test(userAgent)) {
        return name
      }
    }
  }
  return null
}


//判断PC端浏览器版本
export function checkBrowser({ie = 10, chrome = 40, firefox = 40, safari = 500 } = {}) {
  var browser = getBrowserInfo(); //浏览器信息
  //alert(browser);//IE 11.0
  //IE11以下： MSIE 10.0、MSIE9.0等
  //chrome：chrome/41.0.2272.89 [返回的是个数组]
  //firefox: firefox/42.0 [返回的是个数组]
  browser = browser + ''; // 转为字符串
  var verinfo = browser.replace(/[^0-9.]/ig, ""); //浏览器版本
  var verNum = verinfo.substr(0,verinfo.indexOf('.')) - 0 //浏览器大版本号转数字类型
  //IE浏览器: 11.0/10.0/9.0
  if(/ie/.test(browser) && verNum < ie){
    alert('您的IE浏览器版本过低, 请安装最新版本chrome/firefox/QQ浏览器')
    return false
  }
  //chrome浏览器：41.0.2272.89
  if(/chrome/.test(browser) && verNum < chrome){
    alert('您的chrome浏览器版本过低, 请安装最新版本chrome/firefox/QQ浏览器')
    return false
  }
  //Firefox浏览器： 42.0
  if(/firefox/.test(browser) && verNum < firefox){
    alert('您的firefox浏览器版本过低, 请安装最新版本chrome/firefox/QQ浏览器')
    return false
  }
  //safari浏览器： 42.0
  if(/safari/.test(browser) && verNum < safari){
    alert('您的safari浏览器版本过低, 请安装最新版本chrome/firefox浏览器')
    return false
  }
  
  return true

  function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();
    //console.log(agent);
    //agent chrome : mozilla/5.0 (windows nt 6.1; wow64) applewebkit/537.36 (khtml, like gecko) chrome/41.0.2272.89 safari/537.36
    //agent firefox : mozilla/5.0 (windows nt 6.1; wow64; rv:42.0) gecko/20100101 firefox/42.0
    //agent IE11: mozilla/5.0 (windows nt 6.1; wow64; trident/7.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729;
    //接上.net clr 3.0.30729; media center pc 6.0;infopath.2; .net4.0c; .net4.0e; rv:11.0) like gecko
    // (可以看出IE11中不包括MSIE字段)
    //agent IE10: mozilla/5.0(compatible; msie 10.0; windows nt 6.1; wow64; trident/6.0)
    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;
    //IE11以下
    if (agent.indexOf("msie") > 0) {
      return agent.match(regStr_ie);
    }
    //IE11版本中不包括MSIE字段
    if (agent.indexOf("trident") > 0 && agent.indexOf("rv") > 0) {
      return "ie " + agent.match(/rv:(\d+\.\d+)/)[1];
    }
    //firefox
    if (agent.indexOf("firefox") > 0) {
      return agent.match(regStr_ff);
    }
    //Chrome
    if (agent.indexOf("chrome") > 0) {
      return agent.match(regStr_chrome);
    }
    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
      return agent.match(regStr_saf);
    }

    return false
  }
}
/* 10 环境 E */