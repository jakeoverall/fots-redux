function GridController(gridService) {
  var brushElem = document.getElementById('brush')
  var gridElem = document.getElementById('grid')

  function drawGrid(grid, tiles) {
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
  }

  function drawTiles(tiles) {
    var elem = document.getElementById('tiles')
    var template = ''
    var activeTile = gridService.getActiveTile()
    for (var t in tiles) {
      var tile = tiles[t]
      template += `
			<li 
				class="list-group-item ${activeTile == tile ? 'active' : ''}"
				onclick="app.controllers.gridCtrl.setActiveTile(${tile.id})"><img src="${tile.url}"> - ${tile.name}"
			</li>
		`
    }
    elem.innerHTML = ''
    elem.innerHTML = template
  }

  this.setActiveTile = function setActiveTile(id) {
    gridService.setActiveTile(id)
    var activeTile = gridService.getActiveTile()

    var brushElem = document.getElementById('brush')
    brushElem.src = `${activeTile.url}`

    drawTiles(gridService.getTiles())
  }

  gridElem.addEventListener('mousemove', moveBrush)
  gridElem.addEventListener('mousedown', draw)
  gridElem.addEventListener('mouseup', removeDraw)

  function draw(e) {
    var grid = gridService.getGrid()
    var tiles = gridService.getTiles()
    var activeTile = gridService.getActiveTile()
    gridElem.addEventListener('mousemove', draw)
    var cell = e.target
    var id = cell.id.split('-')
    if (e.shiftKey) {
      grid.map[id[0]][id[1]] = 0
    }
    else if (activeTile) {
      grid.map[id[0]][id[1]] = activeTile.id
    }
    gridService.setGrid(grid)
    drawGrid(grid, tiles)
  }

  function removeDraw() {
    gridElem.removeEventListener('mousemove', draw)
    gridElem.addEventListener('mousemove', moveBrush)
  }

  function moveBrush(e) {
    var grid = gridService.getGrid()
    brushElem.style.left = (e.clientX - (grid.settings.tileResolution.x / 2)) + 'px'
    brushElem.style.top = (e.clientY - (grid.settings.tileResolution.y / 2)) + 'px'
  }

  this.updateGrid = function updateGrid(e) {
    var grid = gridService.getGrid()
    var tiles = gridService.getTiles()
    e.preventDefault();
    var form = e.target
    grid.settings.height = form['grid-height'].value || grid.settings.height
    grid.settings.width = form['grid-width'].value || grid.settings.width
    grid.settings.tileResolution.x = form['tile-height'].value || grid.settings.tileResolution.x
    grid.settings.tileResolution.y = form['tile-width'].value || grid.settings.tileResolution.y
    
    brushElem.style.height = (grid.settings.tileResolution.y || brushElem.style.height) + 'px'
    brushElem.style.width = (grid.settings.tileResolution.x || brushElem.style.width) + 'px'

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
    gridService.setGrid(grid)
    drawTiles(tiles)
    drawGrid(grid, tiles)
  }

  drawTiles(gridService.getTiles())
  drawGrid(gridService.getGrid(), gridService.getTiles())
}