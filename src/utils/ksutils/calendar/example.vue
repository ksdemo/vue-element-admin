<template>
  <div class='test'>
    <calendar title="选择日期" :is-show="false" max-date="12m" :start-text.sync="startText" :end-text.sync="endText" @output='output'></calendar>
  </div>
</template>
<script>
import Calendar from './calendar.vue'
export default {
  components: {
    Calendar
  },
  data() {
    return {
      startText: "2017-07-25",
      endText: "2017-07-27"
    }
  },
  methods: {
    output(data) {
      console.log(data)
    }
  }
}
</script>
<style scoped>
</style>
