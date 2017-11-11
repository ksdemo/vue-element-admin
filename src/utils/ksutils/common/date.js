export function getTime(date) {
  return !isNaN(date) ? Number(date) : date ? (new Date(date)).getTime() : (new Date()).getTime()
}
export function getDate(time) {
  return new Date(getTime(time))
}
// 获取该时间戳当天的0点的时间戳
export function getMidnight(date) {
  return (new Date(getDate(date).toDateString())).getTime()
}
/*
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function dateStringify(date, fmt) {
  if (!date) {
    return ''
  }
  date = getDate(date)
  fmt = fmt || 'YYYY-MM-DD HH:mm:SS'
  var obj = {
    'Y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'D': date.getDate(), // 日期
    'Q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'W': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    'S': date.getSeconds(), // 秒
    's': date.getMilliseconds() // 毫秒
  }
  var week = ['日', '一', '二', '三', '四', '五', '六']
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
      var val = obj[i] + ''
      if (i === 'W') {
        return (m.length > 2 ? '星期' : '周') + week[val]
      }
      for (var j = 0, len = val.length; j < m.length - len; j++) {
        val = '0' + val
      }
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}
/*
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'YYYY-MM-DD'，支持如下：Y、M、D、H、m、S、s，不支持w和q
 * @returns 解析后的Date类型日期
 */
export function dateParse(str, fmt) {
  if (!str) {
    return null
  }
  fmt = fmt || 'YYYY-MM-DD HH:mm:SS'
  var obj = {
    Y: 0, //年
    M: 1, //月
    D: 0, //日
    H: 0, //时
    m: 0, //分
    S: 0, //秒
    s: 0  //毫秒
  }
  fmt.replace(/([^YMDHmSs]*?)(([YMDHmSs])\3*)([^YMDHmSs]*?)/g, function(m, $1, $2, $3, $4, idx, old) {
    str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function(_m, _$1) {
      obj[$3] = parseInt(_$1)
      return ''
    })
    return ''
  })
  obj.M-- // 月份是从0开始的，所以要减去1
  var date = new Date(obj.Y, obj.M, obj.D, obj.H, obj.m, obj.S)
  if (obj.s !== 0) {
    date.setMilliseconds(obj.s)
  } // 如果设置了毫秒
  return date
}
/*
 * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
 * 当天的返回时分，当年的返回月日，否则，返回年月日
 */
export function dateStringifyFriendly(date) {
  if (!date) {
    return ''
  }
  date = getDate(date)
  var now = new Date()
  if (now.getTime() - date.getTime() < 60 * 1000) {
    return '刚刚'
  } // 1分钟以内视作“刚刚”
  var temp = dateStringify(date, 'Y年M月D')
  if (temp === dateStringify(now, 'Y年M月D')) {
    return this.stringify(date, 'HH:mm')
  }
  if (date.getFullYear() === now.getFullYear()) {
    return this.stringify(date, 'M月D日')
  }
  return temp
}
/* 离目前多久 */
export function timeDiff(time) {
  if (!time) {
    return ''
  }
  time = getTime(time)
  var diffTime = (new Date()).getTime() - time
  return timeFriendly(diffTime)
}
/*
 * 将一段时长转换成友好格式，如：
 * 147->“2分27秒”
 * 1581->“26分21秒”
 * 15818->“4小时24分”
 * @param {Object} time
 */
export function timeFriendly(time) {
  if (!time) {
    return ''
  }
  time = getTime(time)
  var str = '',
    second = time / 1e3
  if (second < 1) {
    str = '刚刚'
  } else if (second < 60) {
    str = second + '秒'
  } else if (second < 60 * 60) {
    str = (second - second % 60) / 60 + '分' + second % 60 + '秒'
  } else if (second < 60 * 60 * 24) {
    str = (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分'
  } else if (second < 60 * 60 * 24 * 30) {
    str = (second / 60 / 60 / 24).toFixed() + '天'
  } else if (second < 60 * 60 * 24 * 365) {
    str = (second / 60 / 60 / 24 / 30).toFixed() + '个月'
  } else {
    str = (second / 60 / 60 / 24 / 365).toFixed() + '年'
  }
  return str
}
export function getLastTime(time) {
  time = getTime(time)
  var now = (new Date()).getTime(),
    str = '',
    diff = now - time,
    midnight = getMidnight(now)
  if (diff < 1) {
    str = '刚刚'
  } else if (diff < 6e4) {
    str = parseInt(diff / 1e3) + '秒前'
  } else if (diff < 18e5) {
    str = parseInt(diff / 6e4) + '分钟前'
  } else if (diff > now - midnight) {
    str = dateStringify(time, 'YYYY-MM-DD')
  } else {
    var m = diff % 36e5,
      h = parseInt(diff / 36e5)
    m = parseInt(diff / 6e4)
    str = h + '小时' + m + '分前'
  }
  return str
}