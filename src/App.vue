<template lang="html">
  <div id="app">
    <router-view />
    <app-effect />
    <a-confirm ref="confirm" />
  </div>
</template>

<script>
import AppEffect from '@/components/app-effect'

export default {
  components: {
    AppEffect
  },
  mounted () {
    window.$confirm = (info) => this.$refs.confirm.open(info)
  }
}
</script>
