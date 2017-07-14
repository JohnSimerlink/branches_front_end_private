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
import {addTreeToGraph} from './treesGraph.js'

export default {
  name: 'newtree',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newTree: function (event) {
      var fact = newFact(event)
        var factId = fact.id;
      var parentTreeId = document.querySelector('#parentTreeId').value;

      const tree = addTreeToGraph(parentTreeId, fact)
      //TODO add a new tree to db and UI by dispatching a new Tree REDUX action
      var updates = {};
      updates['/trees/' + tree.id] = tree;
      updates['/trees/' + parentTreeId + '/children/']
      firebase.database().ref().update(updates)
      var parentNodeRef = firebase.database().ref('/trees/' + parentTreeId +"children/");
      parentNodeRef.push(tree.id);

      //add tree to the graph

    }
  }
}
</script>