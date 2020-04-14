<template>
  <div ref="editor" class="layout-form-ctrl-editor" v-if="visible" tabindex="0" @keydown.stop="handleKeydown">
    <div class="editor-content">
      <div class="editor-row">
        <span class="editor-picker">
          <a-button class="editor-picker-up" @click="handlePickerUp" tabindex="0">
            <a-icon icon="up" />
          </a-button>
          <span class="editor-picker-text">{{ pickerLabel }}</span>
          <a-button class="editor-picker-down" @click="handlePickerDown" tabindex="0">
            <a-icon icon="down" />
          </a-button>
        </span>
        <a-input placeholder="填充文字" v-if="['normal', 'confirm'].includes(form.picker)" v-model="form.text"></a-input>
        <a-input placeholder="高亮文字" v-if="['delete', 'confirm'].includes(form.picker)" v-model="form.primary"></a-input>
        <a-input placeholder="权限字段" v-model="form.auth" v-if="form.auth || !lock" ref="auth"></a-input>
        <a-button class="editor-lock" size="middle" title="开启权限" v-else @click="unlock">
          <a-icon icon="lock" />
        </a-button>
      </div>
    </div>
    <div class="editor-content editor-btns">
      <a-button ref="cancel" @click="handleCancel" audio="back">
        <a-icon icon="close" :size="30" />
      </a-button>
      <a-button ref="confirm" type="blue" @click="handleConfirm" audio="confirm">
        <a-icon icon="check" :size="30" />
      </a-button>
    </div>
  </div>
</template>

<script>

const initForm = () => {
  return {
    picker: 'normal',
    confirm: false,
    text: '',
    primary: '',
    auth: ''
  }
}

export default {
  name: 'layout-form-ctrl-editor',
  data () {
    return {
      visible: false,
      lock: true,
      form: initForm(),
      options: [
        { label: '普通按钮', value: 'normal' },
        { label: '删除按钮', value: 'delete' },
        { label: '编辑按钮', value: 'update' },
        { label: '确认按钮', value: 'confirm' }
      ]
    }
  },
  computed: {
    pickerLabel () {
      let { options, form } = this
      let target = options.find(option => option.value === form.picker)
      return target ? target.label : '-'
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  methods: {
    open (form) {
      return new Promise((resolve) => {
        this.visible = true
        this.resolve = resolve
        this.form = initForm()
        // 重新设置值
        if (form) {
          for (let key in form) {
            this.form[key] = form[key]
          }
        }
        this.$nextTick(() => {
          this.$el.focus()
        })
      })
    },
    handlePickerUp () {
      let { options, form } = this
      this.$sound.tab.play()
      let targetIndex = options.findIndex(option => option.value === form.picker)
      targetIndex -= 1
      if (targetIndex >= 0) {
        form.picker = options[targetIndex].value
      }
    },
    handlePickerDown () {
      let { options, form } = this
      this.$sound.tab.play()
      let targetIndex = options.findIndex(option => option.value === form.picker)
      targetIndex += 1
      if (targetIndex < options.length) {
        form.picker = options[targetIndex].value
      }
    },
    handleKeydown (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.handleConfirm()
      } else if (e.key === 'Escape') {
        this.$refs.cancel.handleClick()
      }
    },
    handleCancel () {
      this.visible = false
      this.lock = true
      this.resolve = null
    },
    handleConfirm () {
      this.visible = false
      this.lock = true
      let form = this.form
      switch (form.picker) {
        case 'normal':
          form.confirm = false
          form.primary = ''
          break
        case 'delete':
          form.confirm = true
          form.text = '删除'
          break
      }
      this.resolve(form)
      this.resolve = null
    },
    unlock () {
      this.lock = false
      this.$nextTick(() => {
        this.$refs.auth.focus()
      })
    }
  }
}
</script>

<style lang="less">
.layout-form-ctrl-editor {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: @bg-white-fade;
  backdrop-filter: blur(10px);
  position: fixed;
  .flex();
  flex-direction: column;
  animation: fadein 300ms;

  .a-button {
    width: 140px;
    line-height: unset;

    .iconfont {
      text-shadow: unset;
    }
  }

  .editor-btns {
    display: flex;
    justify-content: flex-end;
  }

  .editor-content {
    width: 60vw;
    padding: 30px;
    background-color: @bg-white-fade;
  }

  .editor-content + .editor-content {
    margin-top: @space2;
  }

  .editor-row {
    height: 130px;
    padding: @space;
    background-color: #fff;
    display: flex;
    align-items: center;
  }

  .editor-picker {
    width: 200px;
    height: 100%;
    font-size: 26px;
    color: #333;
    position: relative;
    .flex();
    user-select: none;
  }

  .editor-picker-up,
  .editor-picker-down {
    top: -30px;
    left: 25%;
    width: 50%;
    height: 40px;
    line-height: 40px;
    border: none;
    box-shadow: 0 5px 10px rgba(0, 0, 0, .6);
    font-size: 20px;
    color: #fff;
    background-color: #333;
    position: absolute;
    text-align: center;
    cursor: pointer;

    &:hover {
      filter: brightness(1.2);
    }

    &:active {
      filter: brightness(.8);
    }
  }

  .editor-picker-down {
    top: unset;
    bottom: -30px;
  }

  .a-input {
    background-color: @bg-black-fade;

    input {
      color: #333;
    }
  }

  .editor-lock {
    width: 40px;
    color: #333;
    border-color: #fff;

    &:hover {
      border-color: @blue;
    }
  }
}
</style>
