<template>
    <div id="newFact">
        Question: <input id='newQuestion' type='text'>
        Answer: <input id='newAnswer' type='text'>
        <button id='createNewFact' v-on:click='newFact'>Create New Fact</button>
        current tree selected is {{currentTreeSelected}}
    </div>
</template>
<style>
</style>


<script>
import {Fact} from './fact.js'
import getFirebase from './firebaseService.js'
import {Globals} from './globals.js'
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
        return {
            currentTreeSelected: Globals.currentTreeSelected
        }// this.props['data']
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