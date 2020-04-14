<template>
  <button ref="btn" class="btn-back" @click="handleClick">
    <a-icon icon="back"></a-icon>
  </button>
</template>

<script>
export default {
  name: 'a-back',
  methods: {
    handleClick (e) {
      this.$emit('click', e)
      this.$sound.back.play()
    },
    focus () {
      this.$refs.btn.focus()
    }
  }
}
</script>
