<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin/index'
import editorDashboard from './editor/index'
import welcomeDashboard from './welcome/index'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard, welcomeDashboard },
  data() {
    return {
      currentRole: 'welcomeDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    return
    if (this.roles.indexOf('admin') >= 0) {
      return
    }
    this.currentRole = 'editorDashboard'
  }
}
</script>
