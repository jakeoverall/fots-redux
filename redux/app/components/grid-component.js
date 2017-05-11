function GridComponent(store) {
	var brushElem = document.getElementById('brush')
	var gridElem = document.getElementById('grid')
	var tilesElem = document.getElementById('tiles')

	let component = {
		// Yeah I am going to faking this
		onMount() {
			// Wait what were the names of our mutations?
			// Oh year magic strings those suck...
			// We should probably avoid them by creating and 
			// Exposing our store Mutations and Actions 
			// or..... 
			// Have a fancy framework take care of that heavy lifting for us
			store.addEventListener('CHANGE_GRID', component.methods.setGrid)
			store.addEventListener('CHANGE_ACTIVETILE', component.methods.setActiveTile)
			store.addEventListener('CHANGE_TILES', component.methods.setTiles)

			// These are just the DOM Events from before
			gridElem.addEventListener('mousemove', component.methods.moveBrush)
			gridElem.addEventListener('mousedown', component.methods.draw)
			gridElem.addEventListener('mouseup', component.methods.removeDraw)
		},
		state: {
			grid: {},
			activeTile: {},
			tiles: {}
		},
		methods: {
			// Handles form submit
			updateGrid(e) {
				event.preventDefault()
				let grid = component.state.grid
				let form = e.target
				grid.settings.height = form['grid-height'].value || grid.settings.height
				grid.settings.width = form['grid-width'].value || grid.settings.width
				grid.settings.tileResolution.x = form['tile-height'].value || grid.settings.tileResolution.x
				grid.settings.tileResolution.y = form['tile-width'].value || grid.settings.tileResolution.y
				store.dispatch('updateGrid', grid)
			},

			// This is our draw method which modern frameworks abstract away with bindings
			drawGrid() {
				let grid = component.state.grid
				let tiles = component.state.tiles
				let activeTile = component.state.activeTile

				brushElem.style.height = (grid.settings.tileResolution.y || brushElem.style.height) + 'px'
				brushElem.style.width = (grid.settings.tileResolution.x || brushElem.style.width) + 'px'

				gridElem.style.width = grid.settings.width * grid.settings.tileResolution.x + 'px'
				gridElem.style.height = grid.settings.height * grid.settings.tileResolution.y + 'px'
				var template = ''
				gridElem.innerHTML = ''

				for (var row = 0; row < grid.settings.height; row++) {
					for (var col = 0; col < grid.settings.width; col++) {
						var tileId = grid.map[row][col];
						var tile = tiles[tileId]
						tile ?
							template += `<div id="${row}-${col}" class="cell" 
			style="background-image: url(${tile.url});
			height: ${grid.settings.tileResolution.y}px; 
			width: ${grid.settings.tileResolution.x}px"></div>`
							:
							template += `<div id="${row}-${col}" class="cell empty" 
			style="height: ${grid.settings.tileResolution.y}px; 
			width: ${grid.settings.tileResolution.x}px"></div>`
					}
				}
				gridElem.innerHTML = template
			},
			drawTiles() {
				var template = ''
				var activeTile = component.state.activeTile

				for (var t in component.state.tiles) {
					var tile = component.state.tiles[t]
					template += `
			<li 
				class="list-group-item ${activeTile.id == tile.id ? 'active' : ''}"
				onclick="app.components.gridComponent.methods.selectTile(${tile.id})"><img src="${tile.url}"> - ${tile.name}"
			</li>
		`
				}
				tilesElem.innerHTML = template
			},

			// Handles the User tile selection
			selectTile(tileId) {
				let tile = component.state.tiles[tileId]
				store.dispatch('updateActiveTile', tile)
			},

			// Most the new frameworks abstract these methods to getters
			setActiveTile(tile) {
				component.state.activeTile = tile
				brushElem.src = `${tile.url}`
				component.methods.drawTiles()
			},
			setGrid(grid) {
				component.state.grid = grid
				component.methods.drawGrid()
			},
			setTiles(tiles) {
				component.state.tiles = tiles
				component.methods.drawTiles()
			},

			// Handles actual tile placement
			draw(e) {
				var grid = component.state.grid
				var activeTile = component.state.activeTile
				gridElem.addEventListener('mousemove', component.methods.draw)
				var cell = e.target
				var id = cell.id.split('-')
				if (e.shiftKey) {
					grid.map[id[0]][id[1]] = 0
				}
				else if (activeTile) {
					grid.map[id[0]][id[1]] = activeTile.id
				}

				store.dispatch('updateGridMap', grid)
			},

			// Stuff that we dont care about
			removeDraw() {
				gridElem.removeEventListener('mousemove', component.methods.draw)
				gridElem.addEventListener('mousemove', component.methods.moveBrush)
			},

			moveBrush(e) {
				brushElem.style.left = (e.clientX - (component.state.grid.settings.tileResolution.x / 2)) + 'px'
				brushElem.style.top = (e.clientY - (component.state.grid.settings.tileResolution.y / 2)) + 'px'
			}
		}
	}

	return component
}