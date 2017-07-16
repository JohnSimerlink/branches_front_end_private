<template>
  <div>
    Question: <input id='newTreeQuestion' type='text'>
    Answer: <input id='newTreeAnswer' type='text'>
    <input hidden id='parentTreeId' type='text'>
    <button id='createNewTree' v-on:click='newTree'>Create New Tree</button>
  </div>
</template>

<script>
import {Tree} from './tree.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase();
import {newFact} from './newfact.js';
import {newTree} from './newTree.js';
import {addTreeToGraph} from './treesGraph.js'

export default {
  name: 'newtree',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newTree
  }
}
</script>