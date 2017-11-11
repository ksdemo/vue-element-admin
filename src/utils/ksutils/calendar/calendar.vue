<template>
  <div class='calendar'>
    <group>
      <cell :title="title" primary="content" :value="currentValue" @click.native="showCalendar" is-link></cell>
    </group>
    <calendar-view 
      @output="output" 
      :is-show.sync="isShow"
      :mode="mode"
      :multiple="multiple"
      :auto="auto"
      :start="start"
      :end="end"
      :start-text="startText"
      :end-text="endText"
      :first-day="firstDay"
      :last-day="lastDay"
      :max-date="maxDate"
      :is-holiday="isHoliday"
      :is-vication="isVication"
      :is-work="isWork"
      :border-radius="borderRadius"
      :without-text="withoutText"
    ></calendar-view>
  </div>
</template>
<script>
import CalendarView from './core/index.vue'
import props from './core/props.js'
export default {
  props: {
    title: {
      type: String,
      default: '日期:'
    },
    ...props
  },
  components: {
    CalendarView
  },
  data() {
    return {
      isShow : false
    }
  },
  computed: {
    currentValue() {
      if (this.startText && this.endText) {
        if(this.startText == this.endText){
          return this.startText
        }else{
          return this.startText + ' 至 ' + this.endText
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    showCalendar() {
      this.isShow = true
    },
    output(data) {
      this.$emit('update:startText', data.startText)
      this.$emit('update:endText', data.endText)
      this.$emit('output', data)
    }
  }
}
</script>
<style lang="less">
.calendar {
  .weui-cell__ft{
    font-size: 13px;
  }
}
</style>
