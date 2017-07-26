import {Fact} from './fact.js';
import {Config} from '../core/config.js'
import firebase from './firebaseService.js'

const facts = {} // cache
export class Facts {
   static get(factId) {
        if(!factId){
            throw "Facts.get(factId) error! factId empty!"
        }
       return new Promise((resolve, reject) => {
            if (facts[factId]){
                resolve(facts[factId])
            } else {
                firebase.database().ref('facts/' + factId).on("value", function(snapshot){
                    var factData = snapshot.val()
                    var fact = new Fact(factData)
                    facts[fact.id] = fact // add to cache
                    resolve(fact)
                })
            }

       })
   }
   //used for creating a new fact in db. new Fact is just used for loading a fact from the db, and/or creating a local fact that never talks to the db.
   static create({question, answer}){
       var fact = new Fact({question, answer})
       var updates = {};
       updates['/facts/' + fact.id] = fact.getDBRepresentation();
       console.log('facts create updates are', updates)
       firebase.database().ref().update(updates);
       return fact
   }
}
