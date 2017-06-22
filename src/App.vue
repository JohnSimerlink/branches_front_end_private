<style>
   #app {
       display: flex;
       flex-direction: row;
   }
    #facts, #trees-graph {
        flex: 50;
    }

</style>
<template>
   <div id="app">
      <facts id="facts"></facts>
      <!--<trees-graph id="trees-graph"></trees-graph>-->
   </div>
</template>

<script>
import Facts from './facts.vue';
import './trees.js'
import './treesGraph.js'
//import TreesGraph from './trees.vue';
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Facts
//    , TreesGraph
  }
}
</script>

<style lang="scss">
</style>
