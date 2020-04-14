<template>
<div ref="export" class="layout-export" v-if="visible" @keydown.stop.escape="handleBack" tabindex="0">
  <a-back @click="hide" ref="back"></a-back>
  <div class="layout-export-container">
  </div>
</div>
</template>

<script>
export default {
  name: 'layout-export',
  data () {
    return {
      visible: false,
      fields: []
    }
  },
  methods: {
    init () {
      if (window.fields) {
        this.fields = window.fields
      }
    },
    show () {
      this.init()
      this.visible = true
      this.$nextTick(() => {
        this.$refs.params.export()
      })
    },
    hide () {
      this.visible = false
      this.$emit('hide', true)
    },
    handleBack () {
      this.$refs.back.handleClick()
    }
  }
}
</script>
