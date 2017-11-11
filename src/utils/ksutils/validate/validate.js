'use strict'
import RULE from './rule.js'
import { extend } from '../common/common.js'
import { ajax } from '../common/request.js'
export default function Validate(inputs, option) {
  return new Validate.prototype.init(inputs, option)
}

extend(Validate.prototype, {
  /* 1. 初始化 S */
  init: function(inputs, option) {
    var defaults = {
      //是否打印提示信息
      debug: false,
      // true 验证所有目标数据, false 遇到第一个致命错误就停止验证;
      checkAll: false,
      // 验证间隔
      delay: 0
    }
    //扩展option
    this.option = extend(true, defaults, option)
    //验证inputs配置
    this.inputs = inputs;
    //最后一次验证时间
    this.lastTime = 0
    //验证timer
    this.timer = null
    //是否验证中
    this.isChecking = false
    //验证数据
    this.datas = null
    //验证异步总数
    this.asyncSum = 0
    //已验证异步数
    this.asyncNum = 0
    //输出状态
    this.state = null
    return this;
  },
  /** 1. 初始化 E **/

  /** 2. 验证逻辑 S **/
  //check 验证方法, 可以直接调用, 验证数据后显示结果, 并执行回调函数
  check: function(datas, callback) {
    var _this = this
    if (this.option.delay > 0) {
      clearTimeout(this.timer)
      this.timer = setTimeout(function() {
        _this._check(datas, callback)
      }, this.option.delay)
    } else {
      this._check(datas, callback)
    }
  },
  _check: function(datas, callback) {
    if (this.isChecking) {
      return
    }
    this.before(datas)
    this.callback = callback
    this.isChecking = true
    this.asyncNum = this.asyncSum = 0
    this.state = {
      errMsg: '',
      warnMsg: '',
      data: {}
    };
    this.datas = datas;
    var inputs = this.inputs,
      name,
      rules,
      result;
    for (name in this.datas) {
      rules = inputs[name]
      if (!rules) {
        this.option.debug && console.warn("数据不在验证规则中: ", name);
        continue
      } else if (rules instanceof Array) {
        rules = rules
      } else if (typeof rules === 'object') {
        rules = [rules]
      } else {
        throw new Error('inputs[' + name + ']参数类型错误')
      }
      result = this.checkByRules(name, rules)
      if (this.setState(name, result)) {
        break
      }
    }
    this.checkOver()
  },
  checkOver: function() {
    var state = this.state;
    if (this.asyncNum === this.asyncSum) {
      this.isChecking = false
      if (state.errMsg) {
        this.error()
      } else if (state.warnMsg) {
        this.warn()
      } else {
        this.success()
      }
      this.complete()
      this.callback && this.callback(state)
    } else if (this.asyncNum > this.asyncSum) {
      console.error("哪里出错了 asyncSum: " + this.asyncSum + " asyncNum:" + this.asyncNum)
    }
  },
  /*
   * [setState description]
   * @name {[string]}     [数据名]
   * @result {[object]}   [单条数据的单条规则验证结果]
   */
  setState: function(name, result) {
    var data = this.state.data,
      type = result && result.rule.type || 'success',
      message = result && result.rule.message || '',
      rule = result && result.rule || null;
    if (!data[name] || result) {
      data[name] = {
        name: name,
        value: this.datas[name],
        type: type,
        message: message,
        rule: rule
      }
      if (type === 'error') {
        this.state.errMsg = this.state.errMsg || message
        if (!this.option.checkAll) {
          return true
        }
      } else if (type === 'warn') {
        this.state.warnMsg = this.state.warnMsg || message
      }
    }
    return false
  },
  checkByRules: function(name, rules) {
    var result = null,
      target,
      rule
    for (var i = 0, iL = rules.length; i < iL; i++) {
      rule = rules[i]
      rule.type = rule.type || 'error' // 默认 error
      target = {
        name: name,
        value: this.datas[name],
        rule: rule
      }
      result = this.checkByRule(target)
      if (result && result.rule.type === 'error') {
        return result
      }
    }
    return result
  },
  checkByRule: function(target) {
    var result = null,
      test = target.rule.test
    switch ((typeof test).toLowerCase()) {
      case 'string':
        if (test === 'ajax') {
          this.testAjax(target)
        } else {
          result = this.testString(target)
        }
        break
      case 'object':
        if (test.constructor === RegExp) {
          result = this.testRegExp(target)
        } else {
          throw new Error('正则数据类型错误')
        }
        break
      case 'function':
        if (target.rule.async) {
          this.testAsyncFn(target)
        } else {
          result = this.testSyncFn(target)
        }
        break
      default:
        throw new Error('验证数据错误', target)
    }
    return result
  },
  /* 3. 验证逻辑 E */
  /* 4. 具体类型检测 S */
  testString: function(target) {
    var result = null
    if (!RULE.test(target, this.datas)) {
      result = target
    }
    return result
  },
  testRegExp: function(target) {
    var result = null,
      test = target.rule.test,
      value = target.value ? target.value + '' : ''
    if (!test.test(value)) {
      result = target
    }
    return result
  },
  testSyncFn: function(target) {
    var result = null,
      test = target.rule.test,
      context = target.rule.context || window // rule.context 为传入上下文
    if (!test.call(context, target)) {
      result = target
    }
    return result
  },
  testAjax: function(target) {
    var rule = target.rule
    var _this = this
    if (typeof rule.statusName !== 'undefined' && typeof rule.statusValue !== 'undefined' &&  typeof rule.msgName !== 'undefined') {
      rule.test = function(target, cb) {
        var ajaxData = rule.staticData || {} // 附加的固定数据
        ajaxData[target.name] = target.value // 验证目标数据
        ajaxData._t = (new Date()).getTime() // 防止缓存
        if (rule.variable) { // 其他可变数据
          for (var key in rule.variable) {
            ajaxData[key] = _this.datas[rule.variable[key]]
          }
        }
        ajax({
          url: rule.url,
          type: rule.method || 'GET',
          data: ajaxData,
          success: function(res) {
            if (res[rule.statusName] === rule.statusValue) {
              cb(true)
            } else {
              cb(false, res[rule.msgName])
            }
          },
          error: function(status) {
            cb(false, '网络连接错误,请稍后尝试' + status)
          }
        })
      }
      rule.async = true
      return this.testAsyncFn(target)
    } else {
      throw new Error('缺少必要参数!')
    }
  },
  testAsyncFn: function(target) {
    var result = null,
      name = target.name,
      test = target.rule.test,
      context = target.rule.context || window,
      _this = this
    _this.asyncSum++
    setTimeout(function() {
      //如果已验证出错误,则停止远程验证
      if (_this.state.errMsg) {
        _this.asyncNum++;
        _this.setState(name, result)
        _this.checkOver()
      }
      //否则远程验证
      else {
        // 异步回调执行
        test.call(context, target, function(isSuccess, errMsg) {
          _this.asyncNum++
          if (!isSuccess) {
            result = extend(true, {}, target);
            result.rule.message = errMsg || result.rule.message
          }
          _this.setState(name, result)
          _this.checkOver()
        })
      }
    }, 0)
    return result
  },
  /* 4. 具体类型检测 E */
  /* 5. 钩子函数 S */
  before: function() {
    this.option.before && this.option.before(this.datas)
  },
  success: function() {
    this.option.success && this.option.success(this.state)
  },
  warn: function() {
    this.option.warn && this.option.warn(this.state)
  },
  error: function() {
    this.option.error && this.option.error(this.state)
  },
  complete: function() {
    this.option.complete && this.option.complete(this.state)
  }
/* 5. 钩子函数 E */
})
Validate.prototype.init.prototype = Validate.prototype;
