const state = {
    user: {
        id: "",
        name: "",
        imgUrl: "",
        token: ""
    }
  
  }
  
  //getters
  const getters = {
    user: state  => {
      return state.user;
    }
  }
  
  //actions
  const actions = {
  
  }
  
  //mutations
  const mutations = {
      setUser(state, user) {
        state.user = user;
      } 
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }
  