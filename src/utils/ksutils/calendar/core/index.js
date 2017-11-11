"use strict";
import { extend } from '../../common/common.js';
import { dateStringify, dateParse } from '../../common/date.js';
const utils = require('../lib/utils.js');
export default function Calendar(opts) {
  return new Calendar.prototype.init(opts);
}
Calendar.prototype = {
  /** 1. 初始化 S **/
  constructor: Calendar,
  init: function(opts) {
    var defaults = {
      /* 基本属性 S */
      isShow: false, //Boolean: 是否显示
      mode: 'double', //Sring: double|single 选择模式: 默认双选:开始-结束, 单选: 日期
      multiple: 0, //Number: 单选|多选数量
      auto: false, //Boolean: 单选下是否自动关闭
      firstDay: 0, //Number 时间戳: 可选择的第一天
      lastDay: 0, //Number 时间戳: 可选择的最后一天
      start: 0, //Number 时间戳: 开始日期
      end: 0, //Number 时间戳: 结束日期
      startText: '', //String:开始日期,2015-01-01格式
      endText: '', //String:结束日期,2015-01-01格式
      maxDate: '6m', //String: 日历月数,也可天数 '120d'
      isVication: true, //Boolean: 是否显示假期别名
      isHoliday: false, //Boolean: 是否显示假期角标
      isWork: false, //Boolean: 是否显示假期调休工作日
      borderRadius: false, //Boolean: 是否显示开始结束同一天时为圆角
      withoutText: false, //Boolean: 是否不显示下方文本
      week: ['日', '一', '二', '三', '四', '五', '六'],
      extend: {}
    };
    this.opts = opts = extend(true, {}, defaults, opts);
    extend(this, opts.extend);
    this.initOpts();
    this.initState();
    return this;
  },
  initOpts() {
    var opts = this.opts
    opts.panel = utils.getAllPanelData(opts.maxDate);
    opts.titleText = opts.titleText || (opts.mode === 'double' ? '请选择请假日期' : '请选择日期')
    opts.firstDay = opts.firstDay || utils.getTodayStartSec()
    opts.lastDay = opts.lastDay || utils.getLastDaySec(opts.maxDate) || Infinity
    if (opts.startText) {
      opts.start = dateParse(opts.startText, 'YYYY-MM-DD').getTime()
    }else if(opts.start){
      opts.startText = dateStringify(opts.start, 'YYYY-MM-DD')
    }
    if (opts.endText) {
      opts.end = dateParse(opts.endText, 'YYYY-MM-DD').getTime()
    }else if(opts.end){
      opts.endText = dateStringify(opts.end, 'YYYY-MM-DD')
    }
    typeof Object.freeze === 'function' && (this.opts = Object.freeze(opts))
  },
  initState() {
    var opts = this.opts
    this.state = {
      isShow: opts.isShow,
      mode: opts.mode,
      titleText: opts.titleText,
      firstDay: opts.firstDay,
      lastDay: opts.lastDay,
      start: opts.start,
      startText: opts.startText,
      end: opts.end,
      endText: opts.endText
    }
  },
  //2 内部方法
  isDisable(date) {
    var t = new Date(date).getTime();
    return t < this.state.firstDay || this.state.lastDay < t
  },
  isHoliday(date) {
    return this.opts.isHoliday && utils.judgeIsHoliday(date)
  },
  isWork(date) {
    return this.opts.isWork && utils.judgeIsWork(date)
  },
  //3 外部方法
  select(date) {
    if (!date || this.isDisable(date)) {
      return;
    }
    switch (this.state.mode) {
      case 'double':
        this.selectDoubel(date)
        break;
      case 'single':
        this.selectSingle(date)
        break;
    }
  },
  selectDoubel(date) {
    var state = this.state
    var t = date.getTime()
    //已确定结束日期, 则重选,此次选中开始日期
    if (state.end) {
      state.start = t;
      state.end = null;
      state.titleText = '请选择结束日期'
    }
    //已确定开始日期,则此次选择结束日期
    else if (state.start) {
      //如果结束日期合法
      if (t >= state.start) {
        state.end = t
        state.titleText = '共选择' + utils.calculateDaysNum(state.start, state.end) + '天';
      }
      //否则此次选择开始日期,下次从新选择结束日期
      else {
        state.start = t
        state.end = null
        state.titleText = '请选择结束日期'
      }
    }
    //初始化,此次选中为开始时间,
    else {
      state.start = t
      state.titleText = '请选择结束日期'
    }
  },
  selectSingle(date) {
    var state = this.state
    var t = date.getTime()
    //已确定结束日期, 则重选,此次选中开始日期
    if (state.end == t || state.end == t) {
      state.start = state.end = null;
      state.titleText = '请选择日期'
    } else {
      state.start = state.end = t;
      state.titleText = '已选择' + date.getMonth() + '月' + date.getDate() + '日'
    }
  },
  show() {
    this.state.isShow = true
  },
  hide() {
    this.state.isShow = false
  },
  getText() {
    this.state.startText = dateStringify(this.state.start, 'YYYY-MM-DD')
    this.state.endText = dateStringify(this.state.end, 'YYYY-MM-DD')
  },
  getClass(date) {
    var className = ''
    var state = this.state
    var t = new Date(date).getTime();
    if (state.start == t) {
      className += ' selected-start'
    }
    if (state.end == t) {
      className += ' selected-end'
    }
    if (state.start < t && t < state.end) {
      className += ' selected-line'
    }
    if (this.opts.withoutText) {
      className += ' without-text'
    }
    if (this.opts.borderRadius && state.start == t && t == state.end) {
      className += ' border-radius'
    }
    if (this.isDisable(date)) {
      className += ' disabled'
    }
    if (this.isHoliday(date)) {
      className += ' is-holiday'
    }
    if (this.isWork(date)) {
      className += ' is-work'
    }
    return className.replace(/^\s+|\s+$/, '')
  },
  getDay(date) {
    if (date !== '') {
      return utils.handleCalendarDisplayName(date, this.opts.isVication)
    } else {
      return ''
    }

  }
}
Calendar.prototype.init.prototype = Calendar.prototype;
