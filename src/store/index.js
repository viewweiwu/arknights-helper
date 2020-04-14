import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const load = (key, defaultValue) => {
  let item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item)
  } else {
    return defaultValue
  }
}

export default new Vuex.Store({
  state: {
    hasCheckbox: load('HAS_CHECKBOX', false),
    hasCtrl: load('HAS_CTRL', false),
    ctrls: load('CTRLS', []),
    fields: load('FIELDS', [])
  },
  mutations: {
    SET_CHECKBOX (state, hasCheckbox) {
      state.hasCheckbox = hasCheckbox
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
    },
    ADD_CTRL (state, ctrl) {
      state.ctrls.push(ctrl)
    },
    UPDATE_CTRL (state, { ctrl, i }) {
      state.ctrls.splice(i, 1, ctrl)
    }
  },
  actions: {
    setCheckbox ({ commit }, hasCheckbox) {
      commit('SET_CHECKBOX', hasCheckbox)
      save('HAS_CHECKBOX', hasCheckbox)
    },
    setFields ({ commit }, fields) {
      commit('SET_FIELDS', fields)
      save('FIELDS', fields)
    },
    addField ({ commit, state }, payload) {
      commit('ADD_FIELD', payload)
      save('FIELDS', state.fields)
    },
    updateField ({ commit, state }, payload) {
      commit('UPDATE_FIELD', payload)
      save('FIELDS', state.fields)
    },
    deleteFiled ({ commit, state }, i) {
      commit('DELETE_FIELD', i)
      save('FIELDS', state.fields)
    },
    setCtrl ({ commit }, hasCtrl) {
      commit('SET_CTRL', hasCtrl)
      save('HAS_CTRL', hasCtrl)
    },
    setCtrls ({ commit }, ctrls) {
      commit('SET_CTRLS', ctrls)
      save('CTRLS', ctrls)
    },
    addCtrl ({ commit, state }, ctrl) {
      commit('ADD_CTRL', ctrl)
      save('CTRLS', state.ctrls)
    },
    updateCtrl ({ commit, state }, payload) {
      commit('UPDATE_CTRL', payload)
      save('CTRLS', state.ctrls)
    }
  }
})
