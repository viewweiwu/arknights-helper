<template>
  <button class="a-button" :class="[type, size]" @click="handleClick"><slot></slot></button>
</template>

<script>
export default {
  name: 'a-button',
  props: {
    audio: {
      type: String,
      default: 'click'
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
      this.$sound[this.audio].play()
    }
  }
}
</script>

<style lang="less">
.a-button {
  width: 120px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  border: 1px solid @white;
  background-color: @bg-black-fade;
  user-select: none;
  cursor: pointer;
  text-align: center;

  .iconfont {
    text-shadow: 0 0.2em 4px fadeout(@fade-white, 20%);
  }

  &.small {
    height: 30px;
    line-height: 30px;
  }

  &.middle {
    height: 40px;
    line-height: 40px;
  }

  &:hover,
  &:focus,
  &.active {
    color: @black;
    background-color: @fade-white-hover;

    .iconfont {
      text-shadow: 0 0.4em 5px fadeout(@fade-black, 20%);
    }
  }

  &:active {
    color: @black;
    background-color: @fade-white-active;
  }

  &.blue {
    color: #fff;
    border-color: @blue;
    background-color: @blue;
  }

  &.black {
    color: #fff;
    background-color: @black;
  }

  &.blue,
  &.black {
    &:hover {
      filter: brightness(1.2);
    }

    &:active {
      filter: brightness(.8);
    }
  }

  & + & {
    margin-left: 10px;
  }
}

</style>
