<style>
   #app {
   }
    #facts, #trees-graph {
        flex: 50;
    }
    .app-plan {
        margin-left: 8px;
        margin-right: 8px;
        display: inline;
    }


</style>
<template>
   <div id="app">
       <span class="app-version"> Version: {{version}}</span>
       <span class="app-plan"><a href="https://docs.google.com/presentation/d/101sNSVZnh-olwaRi4hRR5u6KcFKF78LoV5FXYWGlIT4/edit?usp=sharing">The Plan</a></span>
       <span class="app-hire"><a href="mailto:john@branches-app.com">Work for Branches</a></span>
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
