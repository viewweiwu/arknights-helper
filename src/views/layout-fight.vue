<template>
  <div
    class="layout-fight"
    ref="main"
    @keydown.stop.escape="handleBack"
    @mousewheel.self.prevent="handleScroll"
    tabindex="0"
  >
    <a-back ref="back" class="layout-fight-back" @click="hide" />
    <layout-form ref="form" />
    <layout-form-ctrl ref="ctrl" />
    <ul class="layout-fight-content">
      <div class="layout-fight-line"></div>
      <li class="layout-fight-item" @click="addCheckboxRow" v-if="!hasCheckbox">
        <div class="item-symbol"></div>
        <div class="item-content item-lock">
          <p>
            <a-icon icon="lock" :size="60" />
          </p>
          <p>选择框</p>
        </div>
      </li>
      <li class="layout-fight-item" @click="deleteCheckboxRow" v-else>
        <div class="item-symbol"></div>
        <div class="item-content">
          <p>
            <a-icon icon="checkbox" :size="60" />
          </p>
          <p>选择框</p>
        </div>
      </li>
      <li
        v-for="(field, i) in fields"
        :key="field.id"
        class="layout-fight-item cursor"
        tabIndex="0" ref="field"
        @keydown.enter="handleUpdate(field, i)"
        @click="handleUpdate(field, i)"
      >
        <div class="item-symbol"></div>
        <div class="item-content">
          <p>{{ field.title }}</p>
        </div>
      </li>
      <li class="layout-fight-item cursor" @click="handleAdd()" tabIndex="0" ref="add" @keydown.enter="handleAdd()">
        <div class="item-symbol"></div>
        <div class="item-content">
          <a-icon icon="plus" />
        </div>
      </li>
      <li class="layout-fight-item" v-if="!hasCtrl">
        <div class="item-symbol"></div>
        <div class="item-content item-lock" @click="openCtrlRow">
          <p>
            <a-icon icon="lock" :size="60" />
          </p>
          <p>按钮组</p>
        </div>
      </li>
      <li class="layout-fight-item" v-else>
        <div class="item-symbol"></div>
        <div class="item-content" @click="addCtrlRow">
          <p>
            <a-icon icon="btn" :size="60" />
          </p>
          <p>按钮组</p>
        </div>
      </li>
    </ul>
    <div class="layout-fight-ctrl" :style="{ width: (fields.length + 3) * 340 + 160 + 'px' }">
      <div class="ctrl-item" v-for="(field, i) in fields" :key="i" @click="handleAdd(i)">
        <button class="ctrl-item-btn">
          <a-icon icon="plus" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutForm from './layout-form'
import LayoutFormCtrl from './layout-form-ctrl'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'layout-fight',
  components: {
    LayoutForm,
    LayoutFormCtrl
  },
  data () {
    return {
      edit: false
    }
  },
  computed: {
    ...mapState(['hasCheckbox', 'hasCtrl', 'fields'])
  },
  mounted () {
    this.$refs.add.focus()
  },
  methods: {
    ...mapActions(['setCheckbox', 'setCtrl', 'addField', 'updateField']),
    hide () {
      this.$router.back()
      window.fields = this.fields
    },
    handleBack () {
      if (!this.edit) {
        this.$refs.back.handleClick()
      }
    },
    handleScroll (e) {
      let target = this.$refs.main
      let step = 50
      target.scrollLeft += e.deltaY < 0 ? -step : step
    },
    handleAdd (i) {
      this.$sound.stagepull.play()
      this.edit = true
      this.$refs.form.add().then(
        (field) => {
          this.addField({ field, i })
          this.$refs.add.focus()
          this.edit = false
        },
        () => {
          this.$refs.add.focus()
          this.edit = false
        }
      )
    },
    handleUpdate (field, i) {
      this.$sound.stagepull.play()
      this.edit = true
      this.$refs.form.update(field).then(
        (field) => {
          this.updateField({ field, i })
          this.$refs.field[i].focus()
          this.edit = false
        },
        (isDelete) => {
          if (isDelete) {
            this.DELETE_FIELD(i)
          }
          this.$refs.add.focus()
          this.edit = false
        }
      )
    },
    // 添加表格前面 checkbox
    addCheckboxRow () {
      window.$confirm('确认要开启选择框吗？</br>开启后将会在表格最前面出现选择框。').then(() => {
        this.setCheckbox(true)
      }, () => {})
    },
    // 删除表格前面的 checkbox
    deleteCheckboxRow () {
      window.$confirm('确认要移除按钮组吗？').then(() => {
        this.setCheckbox(false)
      }, () => {})
    },
    // 开启表格后面的按钮
    openCtrlRow () {
      window.$confirm('确认要开启按钮组吗？</br>开启后将会在表格最后面出现按钮组。').then(() => {
        this.setCtrl(true)
      }, () => {})
    },
    // 添加表格前面 ctrl
    addCtrlRow () {
      this.$refs.ctrl.open()
    }
  }
}
</script>

<style lang="less">
@grid-size: 300px;

.layout-fight-back {
  top: 50px;
  left: 100px;
  position: fixed;
}

.layout-fight {
  top: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  overflow: auto;
  transform: translateY(-50%);
  transition: 300ms;
  outline: false;

  &.hide {
    opacity: 0;
    transform: translateX(-100%) translateY(-50%);
  }
}

.layout-fight-content {
  padding: 0 100px;
  display: flex;
  flex-wrap: nowrap;
}

.layout-fight-item {
  width: @grid-size;
  height: @grid-size;
  flex-shrink: 0;
  position: relative;

  .item-symbol {
    top: -22px;
    left: 10%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #fff;
    z-index: 1;
    position: absolute;

    &::before {
      content: '';
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border: 5px solid #fff;
      border-radius: 50%;
      // background-color: #000;
      position: absolute;
      transform: translate(-50%, -50%);
    }

    &::after {
      content: '';
      top: 50%;
      left: 60%;
      width: @grid-size + 25px;
      height: 1px;
      background-color: #fff;
      z-index: 1;
      position: absolute;
    }
  }

  .item-content {
    width: 100%;
    height: 100%;
    border: 1px solid #fff;
    font-size: 30px;
    .flex();
    flex-direction: column;
    background-color: @fade-black;
    cursor: pointer;
  }

  .item-lock {
    border-style: dashed;
    position: relative;

    &::after,
    &::before {
      content: '';
      top: 0;
      left: 0;
      width: 1px;
      height: @grid-size * 1.4;
      opacity: .5;
      border: 1px dashed #fff;
      position: absolute;
      transform-origin: top left;
      transform: rotate(-45deg);
    }

    &::after {
      left: unset;
      right: 0;
      transform-origin: top right;
      transform: rotate(45deg);
    }
  }

  &:last-child {
    .item-symbol {
      &::after {
        display: none;
      }
    }
  }

  &:focus {
    .item-content {
      background-color: rgba(82, 82, 82, 0.8);
    }
  }

  & + & {
    margin-left: 40px;
  }
}

.layout-fight-ctrl {
  top: ~'calc(50% + 150px + 40px)';
  left: 0;
  min-width: 100%;
  height: 20px;
  padding: 0 100px;
  padding-left: 140px;
  background-color: @fade-black;
  position: absolute;
  display: flex;
  align-items: center;

  .ctrl-item {
    width: @grid-size;
    display: flex;
    justify-content: flex-end;
  }

  .ctrl-item + .ctrl-item {
    margin-left: 40px;
  }

  .ctrl-item-btn {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}

</style>
