<template>
  <span
    class="a-switch"
    :class="{ open: value }"
    tabindex="0"
    @keydown.space.prevent="handleEnter"
    @keydown.enter.prevent="handleEnter"
    @click="handleEnter"
  >
    <input type="checkbox" tabindex="-1" :value="value" />
    <span class="a-switch-label">
      <span class="label-open">开启</span>
      <span class="label-off">关闭</span>
    </span>
    <span class="a-switch-core"></span>
  </span>
</template>

<script>
export default {
  name: 'a-switch',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleEnter () {
      this.$sound.click.play()
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style lang="less">
.a-switch {
  width: 120px;
  height: 40px;
  padding: 10px;
  box-shadow: inset 0 5px 10px @black;
  background-color: @gray;
  display: inline-block;
  position: relative;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  transition: 300ms;

  input {
    left: 200%;
    position: absolute;
  }

  &.open {
    background-color: @dark-blue;

    .a-switch-core {
      left: 55%;
    }
  }
}

.a-switch-label {
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.a-switch-core {
  top: 10%;
  left: 5%;
  width: 40%;
  height: 80%;
  background-color: #fff;
  position: absolute;
  transition: 300ms;

  &::after {
    content: '';
    top: 10%;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/images/dot.png');
    background-size: 100% 100%;
    position: absolute;
    transform: rotate(180deg);
  }
}
</style>
