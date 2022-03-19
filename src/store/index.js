import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import message from './modules/message'
import charRoom from './modules/charRoom'


export default new Vuex.Store({
  modules: {
    message,
    charRoom
  }
})
