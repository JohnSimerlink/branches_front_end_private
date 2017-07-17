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
       Version: {{version}}
   </div>
</template>

<script>
import newtree from './newTree.vue';
import './trees.js'
import './treesGraph.js'
import {Config} from './config.js'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
        version: Config.version
    }
  },
  components: {
     newtree
  }
}
</script>

<style lang="scss">
</style>
