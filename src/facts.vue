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

import newfact from './newfact.vue';
export default {
  name: 'facts',
  data() {
  }
  , components: {
    Fact
    , newfact
  }

}

</script>