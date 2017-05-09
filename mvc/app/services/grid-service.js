function GridService() {

  var grid = {
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

  var tiles = {
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

  var activeTile = {}

  this.setGrid = (grid) => {
    grid = grid
  }

  this.getGrid = () => {
    return grid
  }

  this.getTiles = () => {
    return tiles
  }

  this.getActiveTile = () => {
    return activeTile
  }

  this.setActiveTile = (id) => {
    activeTile = tiles[id]
  }

}