<template>
  <div>
    Question: <input id='newQuestion' type='text'>
    Answer: <input id='newAnswer' type='text'>
    <button id='createNewFact' v-on:click='newFact'>Create New Fact</button>
  </div>
</template>


<script>
import {Fact} from './fact.js'
import getFirebase from './firebaseService.js'
function createAndWriteFactFromQA(question,answer){
  var fact = new Fact(question, answer);
  console.log('the fact just created is', fact)
  writeNewFact(fact);
}
function writeNewFact(fact) {
  const firebase = getFirebase();
  var updates = {};
  updates['/facts/' + fact.id] = fact; 
  console.log('inside of write new fact: firebase is', firebase, 'fb.db is', firebase.database())
  firebase.database().ref().update(updates);
}

export default {
  name: 'newfact',
  data() {
    return {}// this.props['data']
  },
  methods: {
    newFact: function (event) {
      var question = document.querySelector('#newQuestion').value;
      var answer = document.querySelector('#newAnswer').value;
      createAndWriteFactFromQA(question,answer) 
    }
  },
  props: ['id', 'question', 'answer']
}
</script>