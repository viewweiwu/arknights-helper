<template>
  <span class="a-radio" tabindex="0">
    <label v-for="option in options" :key="option.value" :class="{ active: value === option.value }">
      <input v-model="currValue" type="radio" :value="option.value" />
      <span class="a-radio-label">{{ option.label }}<slot :option="option"></slot></span>
    </label>
  </span>
</template>

<script>
export default {
  name: 'a-radio',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
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
    handleEnter () {
      this.$emit('input', !this.value)
    },
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="less">
.a-radio {
  background-color: @gray;
  display: flex;
  user-select: none;
  position: relative;

  &:focus-within {
    outline: -webkit-focus-ring-color auto 1px;
  }

  label {
    width: 100px;
    height: 40px;
    color: #fff;
    position: relative;
  }

  input {
    opacity: 0;
    z-index: -1;
    outline: none;
    position: absolute;
  }

  input:checked {
    margin-left: 10px;
    & + .a-radio-label {
      background-color: @dark-blue;
    }
  }

  .a-radio-label {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    .flex();
  }

  &::after {
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 5px 10px @black;
    z-index: 1;
    position: absolute;
    pointer-events: none;
  }
}
</style>
