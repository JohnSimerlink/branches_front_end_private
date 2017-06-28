<template>
  <div>
    Fact Id: <input id='factId' type='text'>
    Tree Id: <input id='treeId' type='text'>
    X: <input id='treeX' type='text'>
    Y: <input id='treeY' type='text'>
    <button id='createNewTree' v-on:click='newTree'>Create New Tree</button>
  </div>
</template>

<script>
import {Tree} from './tree.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase();

export default {
  name: 'newtree',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newTree: function (event) {
      var factId = document.querySelector('#factId').value;
      var treeId = document.querySelector('#treeId').value;
      var x = document.querySelector('#treeX').value;
      var y = document.querySelector('#treeY').value;
      var tree = {treeId, factId, x, y}
      var updates = {};
      updates['/trees/' + tree.treeId] = tree;
      firebase.database().ref().update(updates)
    }
  }
}
</script>