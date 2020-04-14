import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasCheckbox: false,
    hasCtrl: false,
    ctrls: [],
    fields: []
  },
  mutations: {
    SET_CHECKBOX (state, checked) {
      state.hasCheckbox = checked
    },
    SET_FIELDS (state, fields) {
      state.fields = fields
    },
    ADD_FIELD (state, { field, i }) {
      if (i !== undefined) {
        state.fields.splice(i, 0, field)
      } else {
        state.fields.push(field)
      }
    },
    UPDATE_FIELD (state, { field, i }) {
      state.fields.splice(i, 1, field)
    },
    DELETE_FIELD (state, i) {
      state.fields.splice(i, 1)
    },
    SET_CTRL (state, hasCtrl) {
      state.hasCtrl = hasCtrl
    },
    SET_CTRLS (state, ctrls) {
      state.btns = ctrls
    }
  },
  actions: {
  }
})
