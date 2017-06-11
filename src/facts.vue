<template>
<div>
  <h2> this is a list of facts</h2>
  <!-- <fact data='fact'></fact> -->
  <ul>
    <fact v-for='fact in facts' :id='fact.id' :question='fact.question' :answer='fact.answer'></fact>
  </ul>
  <newfact></newfact>
</div>

 </template>


<script>
import Fact from './fact.vue';
import newfact from './newfact.vue';
var md5 = require('md5');
const local = false;
const factListObj = {};
factListObj.data = [];
var facts = {
"126b28d1a4184e4d7d99656feebd823b":{"answer":"If you have an HTML element with a CSS `display` value of `flex` and `flex-direction` value ","id":"126b28d1a4184e4d7d99656feebd823b","question":"What does flex-direction do?"},
"1d1ec14bc8010cbfb42ce160744248ff":{"answer":"3","id":"1d1ec14bc8010cbfb42ce160744248ff","question":"what is 2+1"},
"34bd2fe8d329d9bc7b6c5e78397d1a1f":{"answer":"4","id":"34bd2fe8d329d9bc7b6c5e78397d1a1f","question":"what is 2+2"},
"591fa736595d0f5c18c295a81046350b":{"answer":"it's who you know","id":"591fa736595d0f5c18c295a81046350b","question":"It's not what you know . . . "},
"5b798954b7c7414de1f232813e0ffb0b":{"answer":"flex-direction; justify-content; align-items; flex; flex-order; (Tip: direction, cross-axes, positioning, ordering)","id":"5b798954b7c7414de1f232813e0ffb0b","question":"List the 5 main flexbox properties:"},
"abdb7623bca3eca1918af5c1d76ed863":{"answer":"row; row-reverse; column; column-reverse","id":"abdb7623bca3eca1918af5c1d76ed863","question":"List the possible values for flex-direction"},
"e41b48edf89e0a90e2f9f3b4cf3a2c7b":{"answer":"79","id":"e41b48edf89e0a90e2f9f3b4cf3a2c7b","question":"2+77"},
"ecd1d2b273b3642feabbcc802d97bf0a":{"answer":"9","id":"ecd1d2b273b3642feabbcc802d97bf0a","question":"2+7"}
};

  var factsRef = firebase.database().ref('facts').limitToLast(20);
  factsRef.on('value', function(snapshot){
    factListObj.data = [];
    var ffacts = snapshot.val();
    console.log("firebase data is" + JSON.stringify(ffacts));
    Object.keys(ffacts).forEach( (key) => {
      var fact = ffacts[key];
      factListObj.data.push(fact);
      console.log('fact list data is', factListObj.data);
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