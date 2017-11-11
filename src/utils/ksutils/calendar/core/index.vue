<style src="./index.less" lang="less"></style>
<template>
  <div class="vue-calendar">
    <div class="vue-calendar-backdrop" v-show="isShow" @click.prevent="calculateResult('vue-calendar-cancle')"></div>
    <transition name="vue-component-calendar-content">
      <div class="vue-calendar-content" v-show="isShow" id="vueCalendarTemplate">
        <div class="vue-calendar-content-title-wrapper" id="topHeight1">
          <div class="text">{{state.titleText}}</div>
          <div class="vue-component-calendar-complete-button">
            <a href="javascript:;" @click.prevent="calculateResult('vue-calendar-confirm')">完成</a>
          </div>
        </div>
        <div class="week-bar" id="topHeight2">
          <ul>
            <li v-for="week in opts.week" :class="{weekend : week ==='日' || week==='六'}">{{week}}</li>
          </ul>
        </div>
        <div class="month-bar-fixed" id="fixedBarEle">
          {{fixedMonthbar}}
        </div>
        <div id="scrollPanelWrapper">
          <div class="vue-calendar-date-wrapper" id="scrollPanel">
            <div v-for="(month,index) in opts.panel" :key="month.month" class="month-panel">
              <div class="month-bar" :id="'monthBar-'+index" :class="{'first-month-bar': index == 0}">{{month.month}}</div>
              <div class="month-list">
                <ul>
                  <li v-for="(day, i) in month.days" :key="month.month+'day'+i" @click.prevent="selectedFunc(day)" :class="getClass(day)">
                    <span class="dd">{{ getDay(day)}}</span><i></i>
                    <span class="holiday"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import props from './props.js'
import Calendar from './index.js';
var calendar;
import scrollRender from '../lib/iscrollRender.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    ...props
  },
  data() {
    return {
      state: {},
      opts: {},
      fixedMonthbar: ''
    }
  },
  beforeDestroy() {
    calendar = null
  },
  mounted() {
    calendar = Calendar(this.$props);
    this.state = calendar.state;
    this.opts = calendar.opts;
    this.fixedMonthbar = calendar.opts.panel[0].month
    scrollRender.init();
    this.$watch('isShow', function(isShow) {
      if (isShow) {
        scrollRender.renderUI()
      } else {
        scrollRender.removeUI()
      }
    })
  },
  methods: {
    getDay(date) {
      return calendar.getDay(date)
    },
    getClass(date) {
      return calendar.getClass(date)
    },
    /**
     * 日历点选后的状态管理，管理所有的点击状态
     * @param  {Object} $event click event
     * @return {Void}
     */
    selectedFunc: function(date) {
      calendar.select(date)
    },
    /**
     * 点击取消或者完成来触发该方法，计算结果并返回
     * @param  {String} type 'vue-calendar-confirm','vue-calendar-cancle'两种方法
     * @return {Void}
     */
    calculateResult: function(type) {
      switch (type) {
        case "vue-calendar-cancle":
          calendar.hide()
          this.$emit('update:isShow', false)
          break;
        case "vue-calendar-confirm":
          if (calendar.state.start && calendar.state.end) {
            calendar.hide()
            calendar.getText()
            this.$emit('update:isShow', false)
            this.$emit('output', calendar.state)
          } else {
            //todo
          }
          break;
      }

    }
  }
}
</script>
