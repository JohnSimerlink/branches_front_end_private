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
   </div>
</template>

<script>
import Facts from './facts.vue';
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
     Facts
  }
}
</script>

<style lang="scss">
</style>
