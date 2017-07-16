import {Fact} from './fact.js'
import getFirebase from './firebaseService.js'
import {Config} from './config.js'
import {Globals} from './globals.js'
//TODO Replace a lot of this with the Trees.js or Tree.js ORM
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
    firebase.database().ref().update(updates);
}
export function newFact(question, answer){
    var fact = createAndWriteFactFromQA(question,answer)
    return fact;
}
