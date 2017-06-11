<template>
  <div id="app">
    <h2> This is Renaissance </h2>
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
    , Facts
  }
}
</script>

<style lang="scss">
</style>