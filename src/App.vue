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
      <newtree></newtree>
   </div>
</template>

<script>
import Facts from './facts.vue';
import newtree from './newTree.vue';
import './trees.js'
//import './treesGraph.js'
//import './treesGraph2.js'
import './treesGraph4.js'
import './treesGraph.js'
//import newlogin from './newlogin.vue'
import createAccount from './createAccount.vue'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
     Facts,
     newtree,
     createAccount
  }
}
</script>

<style lang="scss">
</style>
