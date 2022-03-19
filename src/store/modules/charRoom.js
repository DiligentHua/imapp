const state = {
    nowRoom: "",
  
  }
  
  //getters
  const getters = {
      nowRoom: state => {
          return state.nowRoom;
      }

  }
  
  //actions
  const actions = {
  
  }
  
  //mutations
  const mutations = {
      setNowRoom(state, data) {
        state.nowRoom = data.id;
        
      }
  
      
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }
  