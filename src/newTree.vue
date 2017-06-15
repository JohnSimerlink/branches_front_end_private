<template>
  <div>
    Fact Id: <input id='factId' type='text'>
    <button id='createNewFact' v-on:click='newTree'>Create New Tree</button>
  </div>
</template>

<script>
import {Tree} from './tree.js'

export default {
  name: 'newtree',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newTree: function (event) {
      var factId = document.querySelector('#factId').value;
      new Tree(factId)
    }
  }
}
</script>