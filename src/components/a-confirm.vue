<template>
<div class="a-confirm" ref="confirm" @keydown.escape="handleCancel" v-if="visible">
  <div class="a-confirm-content">
    <div class="a-confirm-body">
      <span v-html="info"></span>
    </div>
    <div class="a-confirm-footer">
      <button class="a-confirm-cancel" @click="handleCancel">
        <a-icon icon="close"></a-icon>
      </button>
      <button class="a-confirm-check" ref="check" @click="handleCheck">
        <a-icon icon="check"></a-icon>
      </button>
    </div>
  </div>
</div>
</template>

<script>
window.$confirm = (info) => {
  return window.app.$refs.confirm.open(info)
}

export default {
  name: 'a-confirm',
  data () {
    return {
      info: '确认要继续操作吗？',
      visible: false
    }
  },
  methods: {
    open (info) {
      return new Promise((resolve, reject) => {
        this.$sound.popup.play()
        this.info = info
        this.visible = true
        this.resolve = resolve
        this.reject = reject
        this.$nextTick(() => {
          this.$refs.check.focus()
        })
      })
    },
    handleCancel () {
      this.visible = false
      this.$sound.back.play()
      this.reject()
    },
    handleCheck () {
      this.visible = false
      this.$sound.confirm.play()
      this.resolve()
    }
  }
}
</script>

<style lang="less">
.a-confirm {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100%;
  z-index: 20;
  backdrop-filter: blur(10px);
  position: fixed;
  .flex();
  animation: fadein 300ms;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.a-confirm-content {
  width: 788px;
  height: 350px;
  background-color: #fff;
  background-image: url('~@/assets/images/bk.jpg');
  background-position: 90% 70%;
  display: flex;
  flex-direction: column;
}

.a-confirm-body {
  line-height: 30px;
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  .flex();
  text-align: center;
}

.a-confirm-footer {
  height: 60px;
  display: flex;

  .a-icon {
    font-size: 32px;
  }
}

.a-confirm-footer button {
  flex: 1;
  border: none;
  color: #fff;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  mix-blend-mode: color-burn;

  &:focus {
    z-index: 1;
  }

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }
}

.a-confirm-cancel {
  padding-right: 15%;
  background-color: #292929;
  text-align: right;
}

.a-confirm-check {
  padding-left: 15%;
  background-color: #562626;
  text-align: left;
}

</style>
