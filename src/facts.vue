<style>
   #factList {
       display:none;
   }
</style>
<template>
    <div>
      <ul id="factList">
        <fact id='12345' question="What is Shaffan's last name?" answer="Mustafa"></fact>
        <fact v-for='fact in facts' :id='fact.id' :key='fact.id' :question='fact.question' :answer='fact.answer'></fact>
      </ul>
      <newfact id="newFact"></newfact>
    </div>

</template>


  <script>
import getFirebase from './firebaseService.js'
const firebase = getFirebase();
import Fact from './fact.vue';

import newfact from './newfact.vue';
var md5 = require('md5');
const local = false;
const factListObj = {};
factListObj.data = [];

    factListObj.data = [ {
      id: '24',
      question: 'what is sam\'s last name?',
      answer: 'Yinger'
    }]
  var factsRef = firebase.database().ref('facts').limitToLast(20);
  factsRef.on('value', function(snapshot){
    var ffacts = snapshot.val();
    console.log("firebase data is" + JSON.stringify(ffacts));
    Object.keys(ffacts).forEach( (key) => {
      var fact = ffacts[key];
      factListObj.data.push(fact);
//      console.log('fact list data is', factListObj.data);
      // addFactToList(fact);
      // console.log('adding fact to list', fact);
    })
    
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });


export default {
  name: 'facts',
  data() {
    var res = {
      facts: factListObj.data
    };

    if (local) {
      res = {
        facts: Object.keys(facts).map((key) => {return facts[key]; })
        // fact: facts["126b28d1a4184e4d7d99656feebd823b"]
      }
    }
    return res;

  }
  , components: {
    Fact
    , newfact
  }

}

</script>