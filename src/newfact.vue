<template>
  <div>
    Question: <input id='newQuestion' type='text'>
    Answer: <input id='newAnswer' type='text'>
    <button id='createNewFact' v-on:click='newFact'>Create New Fact</button>
  </div>
</template>


<script>
import {Fact} from './fact.js'
function createAndWriteFactFromQA(question,answer){
  var fact = new Fact(question, answer);
  writeNewFact(fact);
}
function writeNewFact(fact) {
  var updates = {};
  updates['/facts/' + fact.id] = fact; 
  firebase.database.ref().update(updates);
}

export default {
  name: 'newfact',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newFact: function (event) {
      var question = document.querySelector('#newQuestion');
      var answer = document.querySelector('#newAnswer');
      createAndWriteFactFromQA(question,answer) 
    }
  },
  props: ['id', 'question', 'answer']
}
</script>