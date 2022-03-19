const state = {
  messageAck: [],      //加入购物车列表

}

//getters
const getters = {
  isAck: state => id => {
    return state.messageAck.indexOf(id);
  }
}

//actions
const actions = {

}

//mutations
const mutations = {
    ackMessage(state, data) {
      let index = state.messageAck.indexOf(data.ack);
      if(index >= 0) {
        state.messageAck.splice(index, 1);
      }
    },
    addAck(state, data) {
      state.messageAck.push(data.ack)
      console.log(state.messageAck);

    }

    
}

export default {
  state,
  getters,
  actions,
  mutations
}
