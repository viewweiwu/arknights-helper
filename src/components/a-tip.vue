<template>
  <div class="a-tip" :class="{ hide: !visible }" ref="tip" @click="hide">
    <a-icon icon="info" class="ml"></a-icon>
    <span v-html="info" class="ml"></span>
  </div>
</template>

<script>
export default {
  name: 'a-tip',
  data () {
    return {
      info: '提示消息',
      visible: false
    }
  },
  methods: {
    open (info) {
      return new Promise((resolve) => {
        this.timer && clearTimeout(this.timer)
        this.$sound.popup.play()
        this.info = info
        this.visible = true
        this.resolve = resolve

        this.timer = setTimeout(() => {
          this.hide()
        }, 5000)
      })
    },
    hide () {
      this.visible = false
      this.resolve()
      this.resolve = null
    }
  }
}
</script>

<style lang="less">
.a-tip {
  top: 100px;
  right: 0;
  width: 200px;
  height: 50px;
  padding: @space;
  z-index: 11;
  color: #fff;
  background-color: @black;
  position: fixed;
  .flex();
  justify-content: flex-start;
  user-select: none;
  transition: 300ms;

  &.hide {
    transform: translateX(120%);
  }
}
</style>
