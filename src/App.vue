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
<<<<<<< HEAD
  <div id="app">
    <h2> This is Renaissance </h2>
  <hello color='blue'></hello>
  <facts></facts>
   {{msg}}
  </div>
=======
   <div id="app">
      <facts id="facts"></facts>
      <!--<trees-graph id="trees-graph"></trees-graph>-->
   </div>
>>>>>>> cbb1e924fb3d4993a2ee3db21aa21de143f043d4
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
<<<<<<< HEAD
    Hello
    , SampleVue
    , Facts
=======
    Facts
//    , TreesGraph
>>>>>>> cbb1e924fb3d4993a2ee3db21aa21de143f043d4
  }
}
</script>

<style lang="scss">
</style>
