<template>
<div>
<h2> Log In! </h2>
<h2> Don't have an account? Sign up! </h2>
</div>
<input type="text" name="" value=""></input>
<input type="password"/>
<!--> have to make eye visibiility turn on and off <!-->
<!--> add event listener to check if eye is clicked, toggle visibility <!-->
<!--> use flexbox to make sure that eye appears in the same box as pwd <!-->
<i class="material-icons">visibility</i>
<!--> hopefully if i add this line it will also show on IE9 and older browsers! <!-->
<i class="material-icons">&#xE8F4;</i>

<button v-on:click="toggle"></button>


<!--> <!-->
</div>
</template>
<script>
function clickCreateAccountButton() {
    // should make username + password dissapear, replace with message that verifcation email has been sent,
    // also display logout button
    alert("A verification email has been sent to your email account. Please also check your spam/junk folder just to be safe!");
    <buttton id='logout'>Log Out</button>
}

function clickSignInButton() {
  var loggedin = true;
}

function clickLogoutButton() {
}

function validatePassword() {
}

function validateEmail() {
}

  export default {
    name: 'newlogin',
    data() {
      return {}
    },
    methods: {

    }
}
</script>
