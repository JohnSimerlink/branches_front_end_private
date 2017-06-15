<template>
  <div id="app">
    <h2> This is Renaissance </h2>
  <hello color='blue'></hello>
  <facts></facts>
   {{msg}}
  </div>
</template>

<script>
import Hello from './hello.vue';
import Facts from './facts.vue';
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Hello
    , SampleVue
    , Facts
  }
}
</script>

<style lang="scss">
</style>
