<template>
   <div>
      <h2> This is Renaissance </h2>
      <div id="app">
          <facts></facts>
          <trees-graph></trees-graph>
      </div>
   </div>
</template>

<script>
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
    Facts
    , TreesGraph
  }
}
</script>

<style lang="scss">
</style>
