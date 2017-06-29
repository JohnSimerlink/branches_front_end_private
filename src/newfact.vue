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
import {Config} from './config.js'
import {Globals} from './globals.js'
import {newFact} from './newfact.js'
export default {
    name: 'newfact',
    data() {
        return {
            currentTreeSelected: Globals.currentTreeSelected
        }// this.props['data']
    },
    methods: {
        newFact: newFact
    },
    props: ['id', 'question', 'answer']
}
</script>