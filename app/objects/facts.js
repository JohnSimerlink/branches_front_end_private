import {Fact} from './fact.js';
import {Config} from '../core/config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()

export class Facts {
   //TODO: make resolve "null" or something if fact not found
   static get(factId) {
       return new Promise((resolve, reject) => {
           if (Config.offlineMode){
               const fact = offlineFacts[factId]
               resolve(fact)
           } else {
               firebase.database().ref('facts/' + factId).on("value", function(snapshot){
                   var fact = snapshot.val()
                   resolve(fact)
               })
           }

       })
   }
   //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.
   static create({question, answer}){
       var fact = new Fact(question, answer)
       var updates = {};
       updates['/facts/' + fact.id] = fact;
       firebase.database().ref().update(updates);
       return fact
   }
}
