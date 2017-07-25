<style>
    #facts, #trees-graph {
        flex: 50;
    }
    .header-plan {
        margin-left: 8px;
        margin-right: 8px;
        display: inline;
    }

</style>
<template>
   <div id="header">
       <span class="header-version"> Version: {{version}}</span>
       <span class="header-plan"><a href="https://docs.google.com/presentation/d/101sNSVZnh-olwaRi4hRR5u6KcFKF78LoV5FXYWGlIT4/edit?usp=sharing">The Plan</a></span>
       <span class="header-hire"><a href="mailto:john@branches-app.com">Work for Branches</a></span>
       <button class="login-button"  v-on:click="login"> Login via Facebook </button>
       <span class="login-user-name"></span>
   </div>
</template>

<script>
import {Config} from './config.js'
import {toggleVisibility} from './utils.js'
var userObj = {
    loggedIn: false,
    name: ''
}
export default {
  name: 'app',
  data () {
    return {
        version: Config.version
    }
  },
    methods: {
      login: function(event) {
            console.log('login called')
          var provider = new firebase.auth.FacebookAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function (result) {
              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              var token = result.credential.accessToken;
              document.querySelector('.login-user-name').innerHTML = result.user.displayName
              document.querySelector('.login-button').style.display = 'none'
              console.log('result', result)
              Globals.username = result.user.displayName
              Globals.userId = result.user.uid
          }).catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
          });
      }

    },
  components: {
  }
}
</script>

<style lang="scss">
</style>
