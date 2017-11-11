export default {
  // isShow: {
  //   type: Boolean,
  //   default: false
  // },
  //String: double|single 选择模式: 默认双选:开始-结束, 单选: 日期
  mode: {
    type: String,
    default: 'double'
  },
  multiple: 0,
  //Boolean: 单选下是否自动关闭
  auto: {
    type: Boolean,
    default: false
  },
  //时间戳: 开始日期
  start: {
    type: Number,
    default: 0
  },
  //时间戳: 结束日期
  end: {
    type: Number,
    default: 0
  },
  //String:开始日期,2015-01-01格式
  startText: {
    type: String,
    default: ''
  },
  //String:结束日期,2015-01-01格式
  endText: {
    type: String,
    default: ''
  },
  //时间戳: 可选择的第一天
  firstDay: {
    type: Number,
    default: 0
  },
  //时间戳: 可选择的最后一天
  lastDay: {
    type: Number,
    default: 0
  },
  //String: 日历月数,也可天数 '120d'
  maxDate: {
    type: String,
    default: '6m'
  },
  //Boolean: 是否显示假期别名
  isVication: {
    type: Boolean,
    default: true
  },
  //Boolean: 是否显示假期角标
  isHoliday: {
    type: Boolean,
    default: false
  },
  //Boolean: 是否显示假期调休工作日
  isWork: {
    type: Boolean,
    default: false
  },
  //Boolean: 是否显示圆角
  borderRadius: {
    type: Boolean,
    default: false
  },
  //Boolean: 是否不显示下方文本
  withoutText: {
    type: Boolean,
    default: false
  },
  //Array 星期名称
  week: {
    type: Array,
    default: function(){return ['日', '一', '二', '三', '四', '五', '六']}
  }
}