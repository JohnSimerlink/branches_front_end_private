  <template>
  <!-- need to make buttons for login system, check if password is valid and strong enough -->

  <button v-if="loggedIn" id='logout' v-on:click='clickLogoutButton'>Log Out</button>
  <button id='createNewFact' v-on:click='newFact'>Create New Fact</button>

  <div v-if=>
  </div>
  </template>
  function clickSignUpButton() {
      // should make username + password dissapear, replace with message that verifcation email has been sent,
      // also display logout button


      alert("A verification email has been sent to your email account. Please also check your spam/junk folder just to be safe!")
  }

  function clickSignInButton() {

  }

  function clickLogoutButton() {
    alert()
  }

  function validatePassword() {

  }

  function validateEmail() {

  }
