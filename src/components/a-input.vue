<template>
  <span class="a-input">
    <input ref="input" v-model="currValue" v-bind="$attrs" @focus="handleFocus" />
  </span>
</template>

<script>
export default {
  name: 'a-input',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    currValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    handleClick (e) {
      this.$emit('click', e)
      this.$sound.back.play()
    },
    handleFocus () {
      this.$sound.click.play()
    }
  }
}
</script>
