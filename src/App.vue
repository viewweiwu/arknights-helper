<template lang="html">
  <div id="app">
    <router-view />
    <app-effect />
    <a-confirm ref="confirm" />
    <a-tip ref="tip" />
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
    window.$tip = (info) => this.$refs.tip.open(info)
  }
}
</script>
