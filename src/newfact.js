import {Fact} from './fact.js'
import getFirebase from './firebaseService.js'
import {Config} from './config.js'
import {Globals} from './globals.js'
function createAndWriteFactFromQA(question,answer){
    var fact = new Fact(question, answer);
    console.log('the fact just created is', fact)
    writeNewFact(fact);
    return fact;
}
function writeNewFact(fact) {
    console.log('THE FACT BEEING CREATED IN NEWFACT.JS is ', fact)
    const firebase = getFirebase();
    var updates = {};
    updates['/facts/' + fact.id] = fact;
    console.log('inside of write new fact: firebase is', firebase, 'fb.db is', firebase.database())
    firebase.database().ref().update(updates);
}
export function newFact(event){
    var question = document.querySelector('#newTreeQuestion').value;
    var answer = document.querySelector('#newTreeAnswer').value;
    var fact = createAndWriteFactFromQA(question,answer)
    return fact;
}
