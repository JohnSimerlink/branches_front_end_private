<template>
<div>
<h2> Log In! </h2>
<h2> Don't have an account? Sign up! </h2>
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
  alert()
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
