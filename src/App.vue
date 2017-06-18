<template>
  <div id="app">
    <h2> This is Renaissance </h2>
  <hello color='blue'></hello>
  <hello2 color='red'></hello2>
  <facts></facts>
      <!--<treesgraph></treesgraph>-->
   {{msg}}
  </div>
</template>

<script>
import Hello from './hello.vue';
import Hello2 from './hello2.vue';
import Facts from './facts.vue';
import TreesGraph from './trees.vue';
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Hello
    , Facts
    , TreesGraph
      , Hello2
  }
}
</script>

<style lang="scss">
</style>
