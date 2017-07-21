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
  }
}
</script>

<style lang="scss">
</style>
