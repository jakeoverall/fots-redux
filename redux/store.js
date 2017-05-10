function Store(config) {
  // State - The single source of truth... 
  // This is the current snapshot of our entire application
  var state = config.state
  var listeners = {}
  for (var prop in config.state) {
    listeners[prop] = []
  }

  // The only functions allowed to manipulate the state
  this.mutations = config.mutations

  // The only functions that have access to call mutations
  // Actions are where we create the bulk of our business logic
  this.actions = config.actions

  function commit(fnName, payload) {
    this.mutations[fnName](state, payload)
  }

  // SUBSCRIBER PATTERN HERE THIS IS NOTHING NEW
  this.addEventListener = (prop, cb) => {
    listeners[prop].push(cb)
  }
  this.removeEventListener = (prop, cb) => {
    var i = listeners[prop].indexOf(cb)
    if(i > -1){
      listeners[prop].splice(i, 1)
    }
  }

}


var store = new Store({
  state: {
    grid: {
      settings: {
        width: 10,
        height: 7,
        tileResolution: {
          x: 64,
          y: 64
        }
      },
      map: [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 6, 6, 1, 6, 6, 6, 6, 6, 2],
        [2, 6, 6, 7, 7, 7, 6, 6, 6, 2],
        [2, 3, 6, 7, 5, 7, 6, 6, 6, 2],
        [2, 6, 6, 7, 7, 7, 6, 4, 6, 2],
        [2, 6, 6, 6, 6, 6, 4, 6, 6, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ]
    }
  },
  mutations: {
    CHANGE_GRID(state, payload) {
      this.state.grid = payload.data
    },
    CHANGE_TILES(state, tiles) {

    },
    ADD_TILE(state, tile) {

    }
  },
  actions: {
    updateGrid(grid) {
      // Realistically we probably have some 
      // async request to the server firing off here
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // Commits are delegated and recieve a payload
          // Here we will fake the payload by just passing the grid
          // In A proper application the server manages the data 
          // And will send back the appropriate state
          commit('CHANGE_GRID', { data: grid })
        }, 300)
      })
    },
    updateTiles(tiles) {
      // Realistically we probably have some 
      // async request to the server firing off here
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // Commits are delegated and recieve a payload
          // Here we will fake the payload by just passing the grid
          // In A proper application the server manages the data 
          // And will send back the appropriate state
          commit('CHANGE_TILES', { data: tiles })
        }, 300)
      })
    }
  }
})