<template lang="pug">
.grid-component
  .dashboard
    .sidebar-tool
      i.glyphicon.glyphicon-cog
    .sidebar.open
      .sidebar-content
        h4 Tiles
        ul#tiles.list-group
          li(v-for="t in tiles", @click="selectTile(t)", :class="{'active': activeTile.id == t.id}")
            img(:src="t.url")
            | {{t.name}}
        hr
        //form.form(@submit='updateGrid.prevent()')
          fieldset
            legend Grid Settings
            .form-group
              input.form-control(placeholder='rows', type='text', v-model='formData.height')
            .form-group
              input(placeholder='columns', type='text', v-model='formData.width')
          fieldset
            legend Tile Settings
            .form-group
              input(placeholder='height', type='text', v-model='formData.y')
            .form-group
              input(placeholder='width', type='text', v-model='formData.x')
          div
            button(type='submit') Apply
    .main-content.pushed
      .container-fluid
        .row
          .col-sm-12
            img#brush(:src='activeTile.url', :style="brushStyle" alt='brush')
            #grid.grid(:style="gridStyle")
                .cell(v-for="(cell, i) in cells", :id="i", :style="{'background-image': `url(${cell.url})`, height: grid.settings.tileResolution.y+'px', width: grid.settings.tileResolution.x+'px' }")

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
  name: 'grid',
  state(){
    return {
      gridElm: {},
      formData: {},
      cells: ''
    }
  },
  computed:{
    grid(){
      return this.$store.state.gridModule.grid
    },
    tiles(){
      return this.$store.state.gridModule.tiles
    },
    activeTile(){
      return this.$store.state.gridModule.activeTile
    },
    gridStyle(){
      return {
        height: this.grid.settings.height * this.grid.settings.tileResolution.y + 'px',
        width: this.grid.settings.width * this.grid.settings.tileResolution.x + 'px',
      }
    },
    brushStyle(){
      return {
        height: (this.grid.settings.tileResolution.y || brushElem.style.height) + 'px',
        width: (this.grid.settings.tileResolution.x || brushElem.style.width) + 'px'
      }
    },
    cells(){
      // Just to show how you might keep tighter control over your html
      var grid = this.grid
      var tiles = this.tiles
      var cells = []
      grid.map.forEach(row => { cells = cells.concat(row) })
      cells = cells.map(id => { return this.tiles[id] })
      return cells
    }
  },
  methods:{
    updateGrid(){
      this.grid.settings.height = this.formData.height || this.grid.settings.height
      this.grid.settings.width = this.formData.height || this.grid.settings.width
      this.grid.settings.tileResolution.x = this.formData.x || this.grid.tileResolution.x
      this.grid.settings.tileResolution.y = this.formData.y || this.grid.tileResolution.y
      this.$store.dispatch('updateGrid', this.grid)
    },
    selectTile(tile){
      this.$store.dispatch('updateActiveTile', tile)
    }
  },
  mounted(){
    //might as well keep the mouse tracking with native DOM actions
    var brushElem = document.getElementById('brush')
	  var tilesElem = document.getElementById('tiles')
	  var gridElem = document.getElementById('grid')

    let moveBrush = (e) => {
      brushElem.style.left = (e.clientX - (this.grid.settings.tileResolution.x / 2)) + 'px'
      brushElem.style.top = (e.clientY - (this.grid.settings.tileResolution.y / 2)) + 'px'
    }
    let removeDraw = () => {
      gridElem.removeEventListener('mousemove', draw)
      gridElem.addEventListener('mousemove', moveBrush)
    }
    let draw = (e) => {
      var cells = this.cells
      var id = e.target.id
      var activeTile = this.activeTile
      gridElem.addEventListener('mousemove', draw)

      var cell = e.target

      if (e.shiftKey) {
        cells[id].id = 0
      }
      else if (activeTile) {
        cells[id].id = activeTile.id
      }

      var i = 0
      var ci = 0
      while(i < this.grid.map.length){
        for(var j = 0; j < this.grid.map[i].length; j++){
          this.grid.map[i][j] = cells[ci].id
          ci++
        }
        i++
      }

      this.$store.dispatch('updateGridMap', this.grid)
    }
    // These are just the DOM Events from before
    gridElem.addEventListener('mousemove', moveBrush)
    gridElem.addEventListener('mousedown', draw)
    gridElem.addEventListener('mouseup', removeDraw)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
