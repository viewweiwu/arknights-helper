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
          <th class="table-cell-checkbox">
            <div class="table-checkbox"></div>
          </th>
          <th v-for="field in fields" :key="field.key">{{ field.title }}</th>
          <th width="400px">操作</th>
        </tr>
        <tr v-for="row in tableData" :key="row.id">
          <td class="table-cell-checkbox">
            <div class="table-checkbox"></div>
          </td>
          <td v-for="field in fields" :key="field.key">{{ row[field.key] }}</td>
          <td class="table-cell-ctrl">
            <a-button>编辑</a-button>
            <a-button>删除</a-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout-preview',
  data () {
    return {
      tableData: window.tableData,
      fields: [
        {
          title: '第一列',
          key: '',
          type: '',
          options: [],
          optionsKey: '',
          hasTableExtend: true,
          table: {
            title: '',
            type: '',
            key: ''
          },
          hasSearchExtend: true,
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
        },
        {
          title: '第二列',
          key: '',
          type: '',
          options: [],
          optionsKey: '',
          hasTableExtend: true,
          table: {
            title: '',
            type: '',
            key: ''
          },
          hasSearchExtend: true,
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
      ]
    }
  },
  computed: {
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
