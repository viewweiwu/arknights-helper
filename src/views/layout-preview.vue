<template>
  <div ref="preview" class="layout-preview" @keydown.escape="handleBack" tabindex="0">
    <a-back ref="back" @click="hide"></a-back>
    <div class="layout-preview-search">
      <div class="form-item" v-for="field in searchFields" :key="field.key">
        <label class="item-label">{{ field.title }}</label>
        <a-input class="item-content" :placeholder="'请输入' + field.title" ref="title"></a-input>
      </div>
      <div class="form-item search-btns">
        <a-button>查询</a-button>
        <a-button>重置</a-button>
      </div>
    </div>
    <div class="layout-preview-table">
      <div class="table-header">
        <a-button>新增</a-button>
        <a-button>删除</a-button>
      </div>
      <table border="1" cellpadding="0" cellspacing="0">
        <tr>
          <th class="table-cell-checkbox" v-if="hasCheckbox">
            <div class="table-checkbox"></div>
          </th>
          <th v-for="field in fields" :key="field.key">{{ field.title }}</th>
          <th width="400px" v-if="hasCtrl">操作</th>
        </tr>
        <tr v-for="row in tableData" :key="row.id">
          <td class="table-cell-checkbox" v-if="hasCheckbox">
            <div class="table-checkbox"></div>
          </td>
          <td v-for="field in fields" :key="field.key">{{ row[field.key] }}</td>
          <td class="table-cell-ctrl" v-if="hasCtrl">
            <a-button size="small" v-for="item in ctrls" :key="item.text">{{ item.text }}</a-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tableData } from './layout-preview-data'

export default {
  name: 'layout-preview',
  data () {
    return {
      tableData
    }
  },
  computed: {
    ...mapState(['fields', 'hasCheckbox', 'hasCtrl', 'ctrls']),
    searchFields () {
      return this.fields.filter((field) => field.hasSearchExtend)
    }
  },
  methods: {
    show () {
      if (window.fields && window.fields.length) {
        this.fields = window.fields
        this.$nextTick(() => {
          this.$refs.preview.focus()
        })
      }
    },
    hide () {
      this.$router.back()
    },
    handleBack () {
      this.$refs.back.handleClick()
    },
    handleClick (e) {
      this.$emit('click', e)
      this.$sound.click.play()
    }
  }
}
</script>

<style lang="less">
.layout-preview {
  height: 100%;
  padding: 20px;
  outline: none;

  td,
  th {
    height: 50px;
    text-align: left;
    padding: 0 @space;
  }

  th {
    background-color: @bg-white-fade;
  }

  table {
    width: 100%;
    border: none;
    border-collapse: collapse;
    background-color: @fade-black;
  }

  .btn {
    height: 40px;
  }

  .table-checkbox {
    width: @space2;
    height: @space2;
    border: 1px solid @white;
    display: inline-block;
  }

  .table-cell-checkbox {
    width: 50px;
    text-align: center;
  }

  .table-cell-ctrl {
    .btn {
      color: @blue;
      border: none;
      width: unset;

      &:hover,
      &:focus {
        color: @black;
      }
    }
  }
}

.layout-preview-search {
  padding: 0 12px;
  overflow: hidden;

  .form-item {
    width: 33%;
    float: left;
  }

  .item-label {
    width: 120px;
    padding-right: 1em;
    text-align: right;
  }

  .a-input {
    flex: 1;
    background-color: @fade-white;
  }

  .search-btns {
    padding-left: 120px;
  }
}

.layout-preview-table {
  padding: @space2;

  .table-header {
    margin: 12px 0;
  }
}
</style>
