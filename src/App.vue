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
     <newlogin></newlogin>
      <facts id="facts"></facts>

   </div>
</template>

<script>
import Facts from './facts.vue';
import './trees.js'
import './treesGraph.js'
import newlogin from './newlogin.vue'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
     Facts,
     newlogin
  }
}
</script>

<style lang="scss">
</style>
