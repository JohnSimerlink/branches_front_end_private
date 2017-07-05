<style>
   #app {
       display: flex;
       flex-direction: column;
   }
    #facts, #trees-graph {
        flex: 50;
    }

</style>
<template>
   <div id="app">
      <newtree></newtree>
   </div>
</template>

<script>
import newtree from './newTree.vue';
import './trees.js'
import './treesGraph.js'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
     newtree
  }
}
</script>

<style lang="scss">
</style>
