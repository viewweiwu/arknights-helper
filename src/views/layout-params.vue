<template>
  <div ref="params" class="layout-params" @keydown.stop.escape="handleBack" tabindex="0">
    <a-back @click="hide" ref="back"></a-back>
    <div class="layout-params-container">
      <div class="layout-params-side">
        <p class="layout-params-header">
          <span>请在此处添加上参数枚举：</span>
          <span class="btns">
            <a-button size="small" @click="value = ''">清空</a-button>
            <a-button size="small" @click="addExampleData">填充测试数据</a-button>
          </span>
        </p>
        <textarea v-model="value"></textarea>
      </div>
      <a-button class="layout-params-btn" @click="handleTransfer">
        <a-icon icon="transfer" :size="20"></a-icon>
      </a-button>
      <div class="layout-params-main">
        <div class="layout-params-header">
          <input type="search" v-model="search" @keydown.stop.enter="handleEnter" placeholder="keyword">
          <a-icon icon="search"></a-icon>
        </div>
        <div class="layout-params-empty">
          <p>没有数据呢。</p>
          <p>可以确认一下查询条件跟数据是否正确。</p>
        </div>
        <div class="layout-params-tag-pane">
          <div class="layout-params-tag" v-for="item in filterList" :key="item.key">
            <h3 class="tag-title">{{ item.title }}</h3>
            <ul class="tag-select">
              <li class="tag-options" v-for="option in item.options" :key="option.value">{{ option.value }}: {{ option.label }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout-params',
  data () {
    return {
      value: '',
      data: [],
      search: '',
      keyword: '',
      exampleData: `{"sex":{"1":"男","2":"女"}}`
    }
  },
  computed: {
    filterList () {
      let keyword = this.keyword
      let data = this.data
      if (!keyword.trim()) {
        return data
      } else {
        return data.filter(item => item.title.includes(keyword) || item.options.some(option => option.label.includes(keyword) || option.value.includes(keyword)))
      }
    }
  },
  methods: {
    init () {
      let params = localStorage.getItem('params')
      if (params) {
        this.value = params
      }
    },
    handleBack () {
      this.$refs.back.handleClick()
    },
    addExampleData () {
      this.value = this.exampleData
    },
    handleTransfer () {
      try {
        let data = JSON.parse(this.value)
        if (data.obj) {
          data = data.obj
        }
        let list = []
        for (let key in data) {
          let options = []
          for (let op in data[key]) {
            options.push({ value: op, label: data[key][op] })
          }
          list.push({
            title: key,
            options
          })
        }
        this.data = list
        localStorage.setItem('params', this.value)
      } catch {}
    },
    handleEnter () {
      this.keyword = this.search
    }
  }
}
</script>

<style lang="less">
.layout-params {
  width: 100%;
  height: 100%;
  padding: 20px;
  outline: none;
  background-color: rgba(0, 0, 0, .3);
  backdrop-filter: blur(10px);
  z-index: 1;
  position: fixed;

  textarea {
    flex: 1;
  }
}

.layout-params-container {
  height: 100%;
  padding: 20px 0;
  display: flex;
  align-items: center;
}

.layout-params-side,
.layout-params-main {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-params-main {
  overflow: auto;
}

.layout-params-btn {
  margin: 0 @space;
}

.layout-params-tag {
  padding: @space;
  margin: @space;

  .tag-title {
    margin-top: 0;
  }

  .tag-options {
    height: 40px;
    line-height: 40px;
    padding: 0 @space;
    margin-bottom: @space;
    margin-left: @space;
    border: 1px solid #fff;
    background-color: @bg-white-fade;
    display: inline-block;
  }
}

.layout-params-header {
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .a-icon {
    top: 50%;
    right: 10px;
    position: absolute;
    transform: translateY(-50%);
  }

  .btn {
    height: 30px;
    line-height: 30px;
  }
}

.layout-params-tag-pane {
  flex: 1;
  overflow: auto;
}

.layout-params-empty {
  padding: 100px;
  .flex();
  flex-direction: column;
}
</style>
