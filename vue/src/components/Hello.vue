<template lang="pug">
.grid-component
  .dashboard
    .sidebar-tool
      i.glyphicon.glyphicon-cog
    .sidebar.open
      .sidebar-content
        h4 Tiles
        ul#tiles.list-group
          li(v-for="t in tiles", @click="selectTile(t)")
            img(:src="t.url")
            | {{t.name}}
        hr
        form.form(@submit='updateGrid.prevent()')
          fieldset
            legend Grid Settings
            .form-group
              input.form-control(placeholder='rows', type='text', v-model='grid.settings.height')
            .form-group
              input(placeholder='columns', type='text', v-model='grid.settings.width')
          fieldset
            legend Tile Settings
            .form-group
              input(placeholder='height', type='text', v-model='grid.settings.tileResolution.y')
            .form-group
              input(placeholder='width', type='text', v-model='grid.settings.tileResolution.x')
          div
            button(type='submit') Apply
    .main-content.pushed
      .container-fluid
        .row
          .col-sm-12
            img#brush(height='64', src='', alt='brush')
            #grid.grid
              .grid-row(v-for="r in grid.map")
                .cell(v-for="c in r", :style="{'background-image': c.url, 'height': grid.settings.height+'px', 'width': grid.settings.width+'px' }", :class="{'active': activeTile.id == c.id}")
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'grid',
  computed:{
    ...mapState([
      'grid',
      'tiles',
      'activeTile'
    ])
  },
  methods:{
    updateGrid(){
      this.$store.dispatch('updateGrid', this.grid)
    },
    selectTile(tile){
      this.$store.dispatch('updateActiveTile', tile)
    }
  },
  mounted(){
    //might as well keep the mouse tracking with native DOM actions
    var brushElem = document.getElementById('brush')
	  var gridElem = document.getElementById('grid')
	  var tilesElem = document.getElementById('tiles')

    function moveBrush(e) {
      brushElem.style.left = (e.clientX - (this.state.grid.settings.tileResolution.x / 2)) + 'px'
      brushElem.style.top = (e.clientY - (this.state.grid.settings.tileResolution.y / 2)) + 'px'
    }
    function removeDraw() {
      gridElem.removeEventListener('mousemove', draw)
      gridElem.addEventListener('mousemove', moveBrush)
    }
    function draw(e) {
      var grid = this.state.grid
      var activeTile = this.state.activeTile
      gridElem.addEventListener('mousemove', draw)
      var cell = e.target
      var id = cell.id.split('-')
      if (e.shiftKey) {
        grid.map[id[0]][id[1]] = 0
      }
      else if (activeTile) {
        grid.map[id[0]][id[1]] = activeTile.id
      }
      this.$store.dispatch('updateGridMap', grid)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
