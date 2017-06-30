<template>
    <div class="create-account">
    <input type="email" name="email" id="email" placeholder="Email Address"/>
    <input type="password" name="password" id="password" placeholder="Password"/>

    <input v-if=passwordVisible> 
        <input type="password" name="password" id="password" placeholder="password"/>

        <i id="visibility" v-on:click="toggleVisibility" class=material-icons>visibility</i>
        <button>Create Account</button>
    </div>
</template>
    
<!--> have to make eye visibiility turn on and off <!-->

<!--> add event listener to check if eye is clicked, toggle visibility <!-->
<!--> use flexbox to make sure that eye appears in the same box as pwd <!-->
<script>
function clickCreateAccountButton() {
    // should make username + password dissapear, replace with message that verifcation email has been sent,
    // also display logout button

function validatePassword(password) {
    //password cannot be less than 8 characters, requires one number, an uppercase letter, and a special character
    const errors = [];
    if (password.length < 8) {
        errors.push({id: 1, message: "Password needs to be 8 or more characters long"})
    }
    if (!/A-Z/.test(password)) {
        errors.push({id: 2, message: "Password needs to have an uppercase letter"})
    }
    if (!/0-9/.test(password)) {
        errors.push({id: 3, message: "Password needs to have a number"})
    }
    if (!/!@#\$%\^\&*\)\(+=._-]+$/.test(password)) {
        errors.push({id: 3, message: "Password must contain a special character"})
    }
}

function validateEmail() {
}

  export default {
    name: 'createAccount',
    data() {
      return {}
    },
    methods: {
        toggleVisibility: function(event) {
            const visibilityIcon = document.querySelector('#visibility');
            const passwordInput = document.querySelector('#password');
            if (visibilityIcon.innerHTML == 'visibility') {
                visibilityIcon.innerHTML = 'visibility_off';
            }
            else {
                visibilityIcon.innerHTML == 'visibility';
                passwordInput.type = 'password';
            }
        }
    }
}
</script>

<style>
    #visibility {
        cursor: pointer;
        margin-left: -24px;
    }
    .create-account {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>