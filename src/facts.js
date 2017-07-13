/**
 * Created by John on 6/21/2017.
 */
import {Fact} from './fact.js';
import {Config} from './config.js'
import getFirebase from './firebaseService.js'
const firebase = getFirebase()
const factsArr = [
    {question: "Less is ... ", answer: 'more'},
    {question: "It's not always the best product that ... ", answer: "wins. (example - according to steve jobs apple was better than windows, but windows won"},
    {question: "What are the two qualities by which a person is judged by others? ", answer: "Competence (power) and warmth [and a third: 'presence']"},
    {question: "How do people judge one's power?", answer: "Their social status, clothes, title ..."},
    {question: "What is a technique to treat other people warmly?", answer: "Imagine they have halos around their head, and that they are the best people/angels you have ever encountered"},
    {question: "How can you treat jerks nicely?", answer: "Change how you see their situation in your head (e.g. say to yourself 'That guy was just diagnosed with cancer'"},
    {question: "What is presence?", answer: "The state of being totally focused and aware on the current moment and place. Not on the future or past. Not thinking about other people/activities, but think about the people you are with now and the activity you are doing now."},
    {question: "What is a technique to instantly get present?", answer: "Focus on your toes, and trying to feel your toes in your shoes (this brings attention to your current senses)"}
]

const offlineFacts = {
    "24":{"id": 24, "answer":" this is an a","question":"this is a q"},
    "126b28d1a4184e4d7d99656feebd823b":{"answer":"If you have an HTML element with a CSS `display` value of `flex` and `flex-direction` value ","id":"126b28d1a4184e4d7d99656feebd823b","question":"What does flex-direction do?"},
    "1d1ec14bc8010cbfb42ce160744248ff":{"answer":"3","id":"1d1ec14bc8010cbfb42ce160744248ff","question":"what is 2+1"},
    "34bd2fe8d329d9bc7b6c5e78397d1a1f":{"answer":"4","id":"34bd2fe8d329d9bc7b6c5e78397d1a1f","question":"what is 2+2"},
    "4f5430fb0fd39072b50ff0b80c453dc3":{"answer":"hello","id":"4f5430fb0fd39072b50ff0b80c453dc3","question":""},
    "591fa736595d0f5c18c295a81046350b":{"answer":"it's who you know","id":"591fa736595d0f5c18c295a81046350b","question":"It's not what you know . . . "},
    "5b798954b7c7414de1f232813e0ffb0b":{"answer":"flex-direction; justify-content; align-items; flex; flex-order; (Tip: direction, cross-axes, positioning, ordering)","id":"5b798954b7c7414de1f232813e0ffb0b","question":"List the 5 main flexbox properties:"},
    "619a3ed7e1ca41843df5b38c4d886b2e":{"answer":"100","id":"619a3ed7e1ca41843df5b38c4d886b2e","question":"99+1"},
    "9b5c4a3fb1a4f239868fbd399ddecd83":{"answer":"21","id":"9b5c4a3fb1a4f239868fbd399ddecd83","question":"10+11"},
    "abdb7623bca3eca1918af5c1d76ed863":{"answer":"row; row-reverse; column; column-reverse","id":"abdb7623bca3eca1918af5c1d76ed863","question":"List the possible values for flex-direction"},
    "ad852f5df11cf523ea97ba5c1742a699":{"answer":"18","id":"ad852f5df11cf523ea97ba5c1742a699","question":"9+9"},
    "bc62641cfd029c281b8ce6135d8991e0":{"answer":". . . the more you earn","id":"bc62641cfd029c281b8ce6135d8991e0","question":"The more you learn . . . "},
    "c1882855355c3e28c1389a1d8eb2a90a":{"answer":"44","id":"c1882855355c3e28c1389a1d8eb2a90a","question":"22+22"},
    "c8d26306d29ff13f0c1010ee0467d47a":{"answer":"There are many genes and coupled mechanisms that seem to essentially be hardcoded such that certain humans processes will stop after 120 years. There is no one variable called lifespan that we can tweak in the human genome","id":"c8d26306d29ff13f0c1010ee0467d47a","question":"Why can't humans currently live past age ~120?"},"cafc5b435101f520710988617dff22bd":{"id":"cafc5b435101f520710988617dff22bd"},
    "dfc27295e2f5527812aad0539c68975b":{"answer":"20","id":"dfc27295e2f5527812aad0539c68975b","question":"10+10"},
    "e41b48edf89e0a90e2f9f3b4cf3a2c7b":{"answer":"79","id":"e41b48edf89e0a90e2f9f3b4cf3a2c7b","question":"2+77"},
    "ecd1d2b273b3642feabbcc802d97bf0a":{"answer":"9","id":"ecd1d2b273b3642feabbcc802d97bf0a","question":"2+7"}
}

export class Facts {
   static getAll(success) {
       if (Config.offlineMode){
       }
   }
   static get(factId) {
       return new Promise((resolve, reject) => {
           if (Config.offlineMode){
               const fact = offlineFacts[factId]
               resolve(fact)
           } else {
               console.log("FACTS.JS: FACTS.get called")
               firebase.database().ref('facts/' + factId).on("value", function(snapshot){
                   var fact = snapshot.val()
                   console.log('FACTS.JS; snapshot from facts.get is', fact)
                   resolve(fact)
               })
           }

       })
   }
   // static get(factId, success){
   //     if (Config.offlineMode){
   //         const fact = offlineFacts[factId]
   //         success(fact)
   //     } else {
   //         console.log("FACTS.JS: FACTS.get called")
   //         firebase.database().ref('facts/' + factId).on("value", function(snapshot){
   //             var fact = snapshot.val()
   //             console.log('FACTS.JS; snapshot from facts.get is', fact)
   //             success(fact)
   //         })
   //     }
   // }
}
