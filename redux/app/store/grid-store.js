function GridStore() {
	let gridStore = new Store({
		state: {
			grid: {},
			tiles: {},
			activeTile: {}
		},
		mutations: {
			CHANGE_GRID(state, payload) {
				state.grid = payload.data
			},
			CHANGE_TILES(state, payload) {
				state.tiles = payload.data
			},
			CHANGE_ACTIVETILE(state, payload) {
				state.activeTile = payload.data
			}
		},
		actions: {
			updateGrid(commit, grid) {
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
			updateGridMap(commit, grid) {
				commit('CHANGE_GRID', { data: grid })
			},
			updateTiles(commit, tiles) {
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
			updateActiveTile(commit, tile) {
				commit('CHANGE_ACTIVETILE', { data: tile })
			}
		}
	})


	// Lets fake a get request

	setTimeout(() => {
		let grid = {
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

		let tiles = {
			1: {
				id: 1,
				name: 'Amethyst',
				url: '/imgs/amethyst.jpg'
			},
			2: {
				id: 2,
				name: 'Boundry',
				url: '/imgs/boundry.png'
			},
			3: {
				id: 3,
				name: 'Coal',
				url: '/imgs/coal.jpg'
			},
			4: {
				id: 4,
				name: 'Cobblestone',
				url: '/imgs/cobblestone.png'
			},
			5: {
				id: 5,
				name: 'Diamond',
				url: '/imgs/diamond.jpg'
			},
			6: {
				id: 6,
				name: 'Dirt',
				url: '/imgs/dirt.png'
			},
			7: {
				id: 7,
				name: 'Gravel',
				url: '/imgs/gravel.png'
			}
		}

		gridStore.dispatch('updateTiles', tiles)
		gridStore.dispatch('updateGrid', grid)
	}, 300)


	return gridStore
}