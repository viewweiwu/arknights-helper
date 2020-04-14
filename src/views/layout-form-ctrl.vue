<template>
  <div ref="ctrl" class="layout-form-ctrl" v-if="visible" @keydown.stop="handleKeydow">
    <div class="layout-form-header">
      <div class="header-left">
        <a-back @click="handleBack" ref="back"></a-back>
        <div class="header-title">
          <a-icon icon="pen"></a-icon>
          <span class="gap">设定按钮</span>
        </div>
      </div>
      <a-button class="small" @click="handleDelete" audio="back">删除此列</a-button>
    </div>
    <div class="ctrl-body">
      <h2 class="ctrl-header">设定按钮</h2>
      <ul class="ctrl-list">
        <li class="ctrl-item" v-for="(item, i) in btns" :key="item.id">
          <div class="ctrl-empty" v-if="!item.form" @click="handleAdd(i)">
            <a-icon icon="plus" :size="40" />
            <p class="ctrl-text">开始添加按钮</p>
          </div>
          <div class="ctrl-added" v-else>
            <header class="ctrl-item-header">按钮信息</header>
            <div class="ctrl-item-body">
              <div class="body-left">
                <p v-if="item.form.auth">
                  <a-icon icon="lock" />
                  {{ item.form.auth }}
                </p>
                <p v-if="item.form.confirm">
                  <a-icon icon="question" />
                  {{ item.form.confirm ? '点击会询问' : '点击不会询问' }}
                </p>
                <p v-if="item.form.confirm">
                  <a-icon icon="light" />
                  {{ item.form.primary }}
                </p>
              </div>
              <div class="body-right">
                <a-button type="blue">{{ item.form.text }}</a-button>
              </div>
            </div>
            <footer class="ctrl-item-footer">
              <a-button type="black" @click="handleDelete(item)">删除</a-button>
              <a-button type="black" @click="handleUpdate(item, i)">修改</a-button>
            </footer>
          </div>
          <span class="ctrl-num">{{ i + 1 }}</span>
        </li>
      </ul>
    </div>
    <layout-form-ctrl-editor ref="editor" />
  </div>
</template>

<script>
import LayoutFormCtrlEditor from './layout-form-ctrl-editor'

export default {
  name: 'layout-form-ctrl',
  components: {
    LayoutFormCtrlEditor
  },
  data () {
    return {
      visible: true,
      btns: [
        {
          id: 1,
          form: null
        },
        {
          id: 2,
          form: null
        },
        {
          id: 3,
          form: null
        },
        {
          id: 4,
          form: null
        }
      ]
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  methods: {
    handleAdd (i) {
      this.$refs.editor.open().then(form => {
        this.btns[i].form = form
      })
    },
    handleUpdate (i) {
      this.$refs.editor.open(this.btns[i].form).then(form => {
        this.btns[i].form = form
      })
    },
    handleBack () {
      this.visible = false
      this.resolve = null
      this.reject = null
      this.reject()
    },
    handleDelete (item) {
      window.$confirm('确认要删除吗？').then(() => {
        item.form = null
      }, () => {})
    },
    handlePickerUp () {
      this.$sound.tab.play()
    },
    handlePickerDown () {
      this.$sound.tab.play()
    }
  }
}
</script>

<style lang="less">
.layout-form-header {
  padding-left: @space;
  border-bottom: @space / 2 solid #fff;
  box-shadow: 0 20px 20px -20px @black;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-title {
    height: 50px;
    padding: 0 @space2;
    margin-left: @space;
    background-color: #fff;
    .flex();
  }
}

.layout-form-ctrl {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 10vh 5vw;
  z-index: 3;
  color: black;
  background-color: @bg-white-fade;
  backdrop-filter: blur(10px);
  position: fixed;
  display: flex;
  flex-direction: column;

  .ctrl-body {
    flex: 1;
    padding: 40px 20vh 0;
    overflow: auto;
  }

  .ctrl-header {
    height: 50px;
    margin: @space;
    padding-left: 100px;
    border-top: 5px solid @orange;
    font-weight: normal;
    font-size: 20px;
    color: #fff;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
  }

  .ctrl-item {
    width: 48%;
    height: 25vh;
    margin: 1%;
    padding: 0 10px;
    font-size: 18px;
    background-size: 8px 8px;
    align-items: center;
    float: left;
    position: relative;
  }

  .ctrl-item-header {
    height: 49px;
    line-height: 49px;
    padding-left: 60px;
    box-shadow: 0 0 5px #333;
    flex-shrink: 0;
  }

  .ctrl-item-body {
    flex: 1;
    margin-top: @space;
    padding: 0 @space3;
    display: flex;

    .body-left {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .body-right {
      flex: 1;
      margin-left: @space2;
      display: flex;
      align-items: center;
    }
  }

  .ctrl-item-footer {
    padding: @space;
    flex-shrink: 0;
    .flex();

    .a-button {
      flex: 1;
      box-shadow: 0 2px 5px #333;
    }
  }

  .ctrl-empty {
    border: 3px solid #fff;
    text-shadow: 3px 3px rgba(0, 0, 0, .3);
    color: #fff;
    background-color: @bg-white-fade;
    background-image: linear-gradient(@bg-white-fade 1px, transparent 0), linear-gradient(90deg, @bg-white-fade 1px, transparent 0);
    .flex();
    flex-direction: column;
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: fadein(@bg-white-fade, 10%);
    }

    &:active {
      background-color: @bg-black-fade;
    }
  }

  .ctrl-added {
    background-color: @fade-white;
    display: flex;
    flex-direction: column;

  }

  .ctrl-added,
  .ctrl-empty {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .ctrl-text {
    margin-top: @space;
  }

  .ctrl-num {
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    font-size: 40px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    user-select: none;
    .flex();
  }
}
</style>
