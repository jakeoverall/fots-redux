import * as firebase from 'firebase'
import Vue from 'vue'
import amethyst from '../assets/imgs/amethyst.jpg'
import boundry from '../assets/imgs/boundry.png'
import coal from '../assets/imgs/coal.jpg'
import cob from '../assets/imgs/cobblestone.png'
import diamond from '../assets/imgs/diamond.jpg'
import dirt from '../assets/imgs/dirt.png'
import gravel from '../assets/imgs/gravel.png'



var config = {
  apiKey: "AIzaSyBh1XI-IRolKG1Sm5g9K-_5cntDkB5igDw",
  authDomain: "tilemap-c487f.firebaseapp.com",
  databaseURL: "https://tilemap-c487f.firebaseio.com",
  projectId: "tilemap-c487f",
  storageBucket: "tilemap-c487f.appspot.com",
  messagingSenderId: "397075266134"
};

const firebaseApp = firebase.initializeApp(config)


export default {
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
    },
    tiles: {
      1: {
        id: 1,
        name: 'Amethyst',
        url: amethyst
      },
      2: {
        id: 2,
        name: 'Boundry',
        url: boundry
      },
      3: {
        id: 3,
        name: 'Coal',
        url: coal
      },
      4: {
        id: 4,
        name: 'Cobblestone',
        url: cob
      },
      5: {
        id: 5,
        name: 'Diamond',
        url: diamond
      },
      6: {
        id: 6,
        name: 'Dirt',
        url: dirt
      },
      7: {
        id: 7,
        name: 'Gravel',
        url: gravel
      }
    },
    activeTile: {}
  },
  mutations: {
    CHANGE_GRID(state, payload) {
      state.grid = payload.data
      Vue.nextTick()
    },
    CHANGE_TILES(state, payload) {
      state.tiles = payload.data
    },
    CHANGE_ACTIVETILE(state, payload) {
      state.activeTile = payload.data
    }
  },
  actions: {
    updateGrid({ commit }, grid) {
      // Realistically we probably have some
      // async request to the server firing off here
      new Promise((resolve, reject) => {
        setTimeout(() => {
          var newMap = [...Array(Number(grid.settings.height))]
          newMap = newMap.map(x => x = [...Array(Number(grid.settings.width))].map(c => c = 0))
          var i = 0;
          while (i < grid.map.length) {
            if (grid.map[i] && newMap[i]) {
              for (var j = 0; j < grid.map[i].length; j++) {
                if (newMap[i][j] != undefined) {
                  newMap[i][j] = grid.map[i][j]
                }
              }
            }
            i++
          }
          grid.map = newMap
          // Commits are delegated and recieve a payload
          // Here we will fake the payload by just passing the grid
          // In A proper application the server manages the data
          // And will send back the appropriate state
          commit('CHANGE_GRID', { data: grid })
        }, 300)
      })
    },
    updateGridMap({ commit }, grid) {

      commit('CHANGE_GRID', { data: grid })

      // Sockets are even more fun :)
      // firebaseApp.database().ref().child('fots-map').set(grid)

    },
    updateTiles({ commit }, tiles) {
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
    },
    updateActiveTile({ commit }, tile) {
      commit('CHANGE_ACTIVETILE', { data: tile })
    },
    connectFirebase({ commit }) {
      firebaseApp.database().ref().child('fots-map').on('value', snap => {
        commit('CHANGE_GRID', snap.val())
      })
    }
  }
}
