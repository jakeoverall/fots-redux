// So what exactly is a store?
function Store(config) {
  // State - The single source of truth... 
  // This is the current snapshot of our entire application
  let state = config.state
  let listeners = {}

  // A simple object to log all state mutations
  let log = {
    mutations: [],
    actions: [],
    addMutationRecord(record) {
      this.mutations.push(record)
      console.log('STATE MUTATION RECORD ADDED', record)
    },
    addActionRecord(record) {
      this.actions.push(record)
      console.log('ACTION RECORD ADDED', record)
    }
  }

  // The only functions allowed to manipulate the state
  let mutations = config.mutations
  // Attaches an array of listeners to each of our mutations
  for (let prop in config.mutations) {
    listeners[prop] = []
  }

  // The only functions that have access to call mutations
  // Actions are where we create the bulk of our business logic
  let actions = config.actions

  // Committing a mutation does a few things
  function commit(mutation, payload) {
    try {
      // Realistically there are more memory performate 
      // ways of cloning an object but this works for our demo
      // We create a clone as to prevent state mutation 
      // elsewhere through pointer references
      let clone = JSON.parse(JSON.stringify(payload.data))
      // Commiting an action will update the state
      // Since our state is about to changed we might as well record the event
      mutations[mutation](state, clone)
      log.addMutationRecord({ state, mutation, payload, clone })

      // Tell the listeners we have modified the state
      listeners[mutation].forEach(observer => observer.fn(payload.data))
    } catch (err) {
      console.warn('UNABLE TO COMMIT:', mutation, err)
      // if something fails this might be a good time to send the commit log
    }
  }

  // Dispatching actions is the only 
  // way we can interact with the store
  this.dispatch = (action, payload) => {
    try {
      actions[action](commit, payload)
    } catch (e) {
      console.error('UNABLE TO DISPATCH INVALID ACTION', action, payload)
    }
  }

  // A SIMPLE SUBSCRIBER PATTERN HERE THIS IS NOTHING NEW
  this.addEventListener = (prop, cb) => {
    listeners[prop].push({ fn: cb, prop: prop })
  }

  this.removeEventListener = (prop, cb) => {
    let pos = -1
    for (let i = 0; i < listeners[prop].length; i++) {
      let observer = listeners[prop][i];
      if (observer.fn == cb) {
        pos = i
        break;
      }
    }
    if (pos > -1) {
      listeners[prop].splice(pos, 1)
    }
  }
}
