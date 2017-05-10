function Store(config) {
  // State - The single source of truth... 
  // This is the current snapshot of our entire application
  this.state = config.state

  // The only functions allowed to manipulate the state
  for (var fn in config.mutations) {
    // This loop will bind the appropriate context of `this` 
    //allowing ease of writting mutations this
    config.mutations[fn] = config.mutations[fn].bind(this)
  }
  this.mutations = config.mutations

  // The only functions that have access to mutations
  this.actions = config.actions

}


var store = new Store({
  state: {
    grid: {}
  },
  mutations: {
    test() {
      console.log(this.state)
    }
  },
  actions: {

  }
})