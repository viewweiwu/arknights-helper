<template>
  <div ref="form" class="layout-form" v-if="visible" @keydown.stop="handleKeydow">
    <div class="layout-form-header">
      <div class="header-left">
        <a-back @click="handleBack" ref="back"></a-back>
        <div class="header-title">
          <a-icon icon="pen"></a-icon>
          <span class="gap">{{ mode === 'add' ? '新增' : '编辑' }}一列</span>
        </div>
      </div>
      <a-button class="small" @click="handleDelete" audio="back" v-if="mode === 'update'">删除此列</a-button>
    </div>
    <div class="layout-form-container">
      <div class="layout-form-tab">
        <div
          v-for="(tab, i) in tabs"
          :key="tab.label"
          class="a-button tab-item"
          :class="{ active: i === active }"
          @click="scrollMain(i)"
        >
          <a-icon :icon="tab.icon"></a-icon>
          <span class="gap">{{ tab.label }}</span>
        </div>
      </div>
      <div ref="main" class="layout-form-main" @scroll="handleScroll">
        <div class="form-wrap">
          <h3 class="form-title" ref="h3">基础配置</h3>
          <div class="form-item">
            <label class="item-label">title</label>
            <a-input class="item-content" placeholder="请输入 title" v-model="form.title" ref="title"></a-input>
            <span class="item-tip">标题</span>
          </div>
          <div class="form-item">
            <label class="item-label">key</label>
            <a-input class="item-content" placeholder="请输入 key" v-model="form.key"></a-input>
            <span class="item-tip">key</span>
          </div>
          <div class="form-item">
            <label class="item-label">type</label>
            <a-input class="item-content" placeholder="请选择 type" v-model="form.type"></a-input>
            <span class="item-tip">标签的类型，这个属性不会应用到 table 上</span>
          </div>
          <div class="form-item">
            <label class="item-label">options</label>
            <div class="item-content">
              <a-input ref="option-input" class="item-content" placeholder="请输入选项" v-model="form.optionsValue" @keydown.native.enter="handleOptionEnter"></a-input>
              <ul class="layout-form-options" v-if="form.options.length">
                <li
                  ref="option"
                  v-for="(option, i) in form.options"
                  :key="option.value"
                  class="option-item"
                  tabindex="0"
                  @keydown.backspace="handleDeleteOption(form.options, i)"
                >
                <span>{{ option.label }}：{{ option.value }}</span>
                <a-icon icon="close" @click="handleDeleteOption(form.options, i)"></a-icon>
              </li>
              </ul>
            </div>
            <span class="item-tip">
              <p class="mb">（label value）回车 <a-icon icon="info"></a-icon></p>
              <p v-if="form.options.length">此选项在表格、查询、弹窗三者都有用，在表格会跟 value 匹配展示 label，在查询和弹窗则展示下拉。</p>
            </span>
          </div>
          <div class="form-item">
            <label class="item-label">optionsKey</label>
            <a-input class="item-content" placeholder="请选择需要的类型" v-model="form.optionsKey"></a-input>
            <span class="item-tip">可以从 systemParams 取 key 值</span>
          </div>
        </div>
        <div class="form-wrap">
          <h3 class="form-title" ref="h3">表格扩展 table</h3>
          <div class="form-item">
            <label class="item-label">show</label>
            <span class="item-content">
              <a-switch v-model="form.hasTableExtend"></a-switch>
            </span>
            <span class="item-tip">是否在表格表格展示这一列？</span>
          </div>
          <div class="form-item">
            <label class="item-label">title</label>
            <a-input class="item-content" placeholder="请输入 title" v-model="form.table.title"></a-input>
            <span class="item-tip">标题</span>
          </div>
          <div class="form-item">
            <label class="item-label">key</label>
            <a-input class="item-content" placeholder="请输入 key" v-model="form.table.key"></a-input>
            <span class="item-tip">key</span>
          </div>
          <div class="form-item">
            <label class="item-label">type</label>
            <a-input class="item-content" placeholder="请选择 type" v-model="form.table.type"></a-input>
            <span class="item-tip">标签的类型，这个属性不会应用到 table 上</span>
          </div>
        </div>
        <div class="form-wrap">
          <h3 class="form-title" ref="h3">查询扩展 search</h3>
          <div class="form-item">
            <label class="item-label">show</label>
            <span class="item-content">
              <a-switch v-model="form.hasSearchExtend"></a-switch>
            </span>
            <span class="item-tip">是否需要在顶部开启搜索？</span>
          </div>
          <div class="form-item">
            <label class="item-label">title</label>
            <a-input class="item-content" placeholder="请输入 title" v-model="form.search.title"></a-input>
            <span class="item-tip">标题，不填写继承基础配置。</span>
          </div>
          <div class="form-item">
            <label class="item-label">key</label>
            <a-input class="item-content" placeholder="请输入 key" v-model="form.search.key"></a-input>
            <span class="item-tip">key，不填写继承基础配置。</span>
          </div>
          <div class="form-item">
            <label class="item-label">type</label>
            <a-input class="item-content" placeholder="请选择 type" v-model="form.search.type"></a-input>
            <span class="item-tip">类型，不填写继承基础配置。</span>
          </div>
        </div>
        <div class="form-wrap">
          <h3 class="form-title" ref="h3">弹窗扩展 dialog</h3>
          <div class="form-item">
            <label class="item-label">show</label>
            <span class="item-content">
              <a-switch v-model="form.hasDialogExtend"></a-switch>
            </span>
            <span class="item-tip">是否需要在顶部开启搜索？</span>
          </div>
          <div class="form-item">
            <label class="item-label">title</label>
            <a-input class="item-content" placeholder="请输入 title" v-model="form.dialog.title"></a-input>
            <span class="item-tip">标题，不填写继承基础配置。</span>
          </div>
          <div class="form-item">
            <label class="item-label">key</label>
            <a-input class="item-content" placeholder="请输入 key" v-model="form.dialog.key"></a-input>
            <span class="item-tip">key，不填写继承基础配置。</span>
          </div>
          <div class="form-item">
            <label class="item-label">type</label>
            <a-input class="item-content" placeholder="请选择 type" v-model="form.dialog.type"></a-input>
            <span class="item-tip">类型，不填写继承基础配置。</span>
          </div>
        </div>
        <div class="form-empty"></div>
      </div>
    </div>
    <div class="layout-form-footer">
      <button class="a-button active" @click="handleConfirm">
        <a-icon icon="done"></a-icon>
        <span class="gap">完成配置</span>
      </button>
    </div>
  </div>
</template>

<script>
import { copy } from '@/util'

export default {
  name: 'layout-form',
  data () {
    return {
      visible: false,
      mode: '',
      active: 0,
      type: 'normal',
      form: this.getForm(),
      appended: false,
      tabs: [
        { label: '基础配置', icon: 'pen' },
        { label: '表格扩展', icon: 'table' },
        { label: '查询扩展', icon: 'filter' },
        { label: '弹窗扩展', icon: 'card' }
      ]
    }
  },
  methods: {
    getForm () {
      return {
        title: '',
        key: '',
        type: '',
        options: [],
        optionsValue: '',
        optionsKey: '',
        hasTableExtend: true,
        table: {
          title: '',
          type: '',
          key: ''
        },
        hasSearchExtend: false,
        search: {
          title: '',
          type: '',
          key: ''
        },
        hasDialogExtend: false,
        dialog: {
          title: '',
          type: '',
          key: ''
        }
      }
    },
    init () {
      this.visible = true
      // 把 el 塞到
      if (!this.appended) {
        this.$nextTick(() => {
          document.body.appendChild(this.$refs.form)
        })
      }
      this.$nextTick(() => {
        this.$refs.title.focus()
      })
    },
    add () {
      return new Promise((resolve, reject) => {
        this.init()
        this.resolve = resolve
        this.reject = reject
        this.form = this.getForm()
        this.mode = 'add'
      })
    },
    update (field) {
      return new Promise((resolve, reject) => {
        this.init()
        this.resolve = resolve
        this.reject = reject
        this.form = copy(field)
        this.mode = 'update'
      })
    },
    handleScroll (e) {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let titleList = [...this.$refs.form.querySelectorAll('h3')]
        let active = titleList.findIndex(item => item.getBoundingClientRect().top >= 0)

        this.active = active
      }, 100)
    },
    handleKeydow (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.handleConfirm()
      } else if (e.key === 'Escape') {
        this.$refs.back.handleClick()
      }
    },
    scrollMain (i) {
      this.$sound.tab.play()
      let $main = this.$refs.main
      let titleList = [...this.$refs.form.querySelectorAll('h3')]
      let target = titleList[i]
      $main.scrollBy({
        top: target.offsetTop - $main.scrollTop,
        behavior: 'smooth'
      })
    },
    handleConfirm () {
      this.$sound.confirm.play()
      this.visible = false
      this.resolve(this.form)
    },
    handleBack () {
      this.visible = false
      this.reject()
      this.resolve = null
      this.reject = null
    },
    handleOptionEnter () {
      let value = this.form.optionsValue.trim()
      if (value) {
        let item = value.split(' ')
        if (item.length >= 2) {
          let option = {
            label: item[0],
            value: item[1]
          }
          this.form.options.push(option)
        }
      }
      this.form.optionsValue = ''
    },
    handleDeleteOption (options, i) {
      options.splice(i, 1)
      if (options.length === 0) {
        this.$refs['option-input'].focus()
      } else {
        this.$nextTick(() => {
          this.$refs.option[i - 1].focus()
        })
      }
    },
    handleDelete () {
      this.reject(true)
      this.handleBack()
    }
  }
}
</script>

<style lang="less">
.layout-form {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 10vh 5vw;
  backdrop-filter: blur(10px);
  z-index: 2;
  color: black;
  background-color: @bg-white-fade;
  position: fixed;

  ::-webkit-scrollbar-thumb {
    background: @black;
  }

  input {
    border-color: transparent;
    color: #333;
    background-color: @bg-black-fade;
  }
}

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

.layout-form-footer {
  margin: @space2 0;
  display: flex;
  justify-content: flex-end;

  .a-button {
    width: 200px;
  }
}

.layout-form-container {
  height: ~'calc(100% - 200px)';
  display: flex;
}

.layout-form-tab {
  margin: @space2;

  .tab-item + .tab-item {
    margin-left: 0;
    margin-top: @space;
  }
}

.layout-form-main {
  padding-left: 10%;
  flex: 1;
  background-color: @fade-white;
  overflow: auto;
  position: relative;
  scroll-snap-type: y;
  scroll-snap-points-y: repeat(100%);
}

.form-wrap {
  // height: 50%;
  scroll-snap-align: start;
}

.form-empty {
  height: 50%;
}

.layout-form-select {
  background-color: transparent;

  label {
    width: 100px;
    height: 100px;
  }

  label + label {
    margin-left: 20px;
  }

  & &::after {
    display: none;
  }
}

.layout-form-options {
  padding-top: @space;

  .option-item {
    height: 40px;
    line-height: 40px;
    padding: 0 @space;
    margin-bottom: @space;
    margin-left: @space;
    border: 1px solid #000;
    display: inline-block;
  }

  .a-icon {
    cursor: pointer;
    &:hover {
      filter: brightness(1.4);
    }
  }
}
</style>
