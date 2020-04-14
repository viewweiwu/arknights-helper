<template>
  <div ref="ctrl" class="layout-form-ctrl" v-if="visible" @keydown.stop="handleKeydow" tabindex="0">
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
        <li class="ctrl-item" v-for="(ctrl, i) in ctrls" :key="i">
          <div class="ctrl-added">
            <header class="ctrl-item-header">按钮样本</header>
            <div class="ctrl-item-body">
              <div class="body-left">
                <p v-if="ctrl.auth">
                  <a-icon icon="lock" />
                  {{ ctrl.auth }}
                </p>
              </div>
              <div class="body-right">
                <div class="a-button blue body-confirm" type="blue" tabindex="0">
                  {{ ctrl.text }}
                  <div class="pop" v-if="ctrl.confirm">
                    <header class="pop-header"><a-icon icon="question" />
                      <span class="gap">确定要删除<span class="pop-primary">{{ ctrl.primary }}</span>吗？</span>
                    </header>
                    <footer class="pop-footer">
                      <a-button class="pop-cancel" size="small">取消</a-button>
                      <a-button type="black" size="small">确定</a-button>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
            <footer class="ctrl-item-footer">
              <a-button type="black" @click="handleDelete(i)">删除</a-button>
              <a-button type="black" @click="handleUpdate(i)">修改</a-button>
            </footer>
          </div>
          <span class="ctrl-num">{{ i + 1 }}</span>
        </li>
        <li class="ctrl-item" v-for="n in max" :key="n * Math.random()">
          <div class="ctrl-empty" @click="handleAdd(n)">
            <a-icon icon="plus" :size="40" />
            <p class="ctrl-text">开始添加按钮</p>
          </div>
        </li>
      </ul>
    </div>
    <layout-form-ctrl-editor ref="editor" />
  </div>
</template>

<script>
import LayoutFormCtrlEditor from './layout-form-ctrl-editor'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'layout-form-ctrl',
  components: {
    LayoutFormCtrlEditor
  },
  data () {
    return {
      visible: false,
      btns: []
    }
  },
  computed: {
    ...mapState(['ctrls']),
    max () {
      let len = 4 - this.ctrls.length
      return len < 0 ? 0 : len
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  methods: {
    ...mapActions(['addCtrl', 'updateCtrl']),
    open () {
      this.visible = true
    },
    handleAdd (n) {
      if (n !== 1) {
        window.$tip(`<p>丷前面空着不好处理</p><p>帮您挪到了第${this.ctrls.length + 1}个</p>`)
      }
      this.$refs.editor.open().then(ctrl => {
        this.addCtrl(ctrl)
      })
    },
    handleUpdate (i) {
      this.$refs.editor.open(this.ctrls[i]).then(ctrl => {
        this.updateCtrl({ ctrl, i })
      })
    },
    handleBack () {
      this.visible = false
    },
    handleDelete (i) {
      window.$confirm('确认要删除吗？').then(() => {
        if (i !== this.ctrls.length - 1) {
          window.$tip('已经自动矫正好顺序')
        }
        this.ctrls.splice(i, 1)
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
  width: 100%;
  height: 100%;
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

    .a-button {
      position: relative;
    }

    .body-confirm {
      &:focus {
        .pop {
          display: block;
        }
      }
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

  .pop {
    bottom: 120%;
    left: 0;
    width: 270px;
    padding: @space;
    color: #333;
    background-color: #fff;
    z-index: 10;
    position: absolute;
    white-space: nowrap;
    display: none;
    overflow: hidden;
    animation: popin 300ms;

    .iconfont {
      text-shadow: unset;
    }
  }

  @keyframes popin {
    from {
      width: 0;
    }
    to {
      width: 270px;
    }
  }

  .pop-header {
    padding-left: @space;
    margin-bottom: @space;
    text-align: left;
  }

  .pop-footer {
    display: flex;
  }

  .pop-cancel {
    color: #333;
    border: none;
    background-color: unset;
  }

  .pop-primary {
    color: @blue;
  }
}
</style>
