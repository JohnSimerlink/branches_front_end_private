<style>
   #app {
   }
    #facts, #trees-graph {
        flex: 50;
    }
    .app-plan {
        margin-left: 8px;
        margin-right: 8px;
        display: inline;
    }
    .pluginLoginButton {
        display: flex !important;
        flex-direction: row;
    }


</style>
<template>
   <div id="app">
       <span class="app-version"> Version: {{version}}</span>
       <span class="app-plan"><a href="https://docs.google.com/presentation/d/101sNSVZnh-olwaRi4hRR5u6KcFKF78LoV5FXYWGlIT4/edit?usp=sharing">The Plan</a></span>
       <span class="app-hire"><a href="mailto:john@branches-app.com">Work for Branches</a></span>
       <!--<div class="fb-login-button" data-max-rows="1" data-size="small" data-button-type="login_with" data-show-faces="true" data-auto-logout-link="false" data-use-continue-as="false"></div>-->
       <button class="login-button"  v-on:click="login"> Login via Facebook </button>
       <span class="login-user-name"></span>

   </div>
</template>

<script>
import './trees.js'
import './treesGraph.js'
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
      msg: 'Welcome to Your Vue.js App',
        version: Config.version,
        loggedIn: userObj.loggedIn,
        userName: userObj.name
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
              console.log('result', result)
              Globals.username = result.user.displayName
              Globals.userId = result.user.uid
              document.querySelector('.login-button').style.display = 'none'
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
