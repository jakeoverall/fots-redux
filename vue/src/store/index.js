import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import gridModule from './grid-module'

let store = {
  modules: {
    gridModule
  },
  state: {
    // Root State Level
    notifications: []
  },
  mutations: {
    clearNotification(state, notification) {
      let i = state.notifications.indexOf(notification)
      if (i > -1) {
        state.notifications.splice(i, 1)
      }
    },
    addNotification(state, notification) {
      state.notifications.push(notification)
    },
  },
  actions: {
    addNotification({ commit }, notification) {
      if (!commit) {
        commit = (fn, payload) => {
          this.mutations[fn].bind(null, this.state)(payload)
        }
      }
      setTimeout(() => {
        commit('clearNotification', notification)
      }, 4000)
      commit('addNotification', notification)
    }
  }
}

export default new Vuex.Store(store)
