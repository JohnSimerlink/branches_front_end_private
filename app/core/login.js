export function login() {
    var mobile = false;

    if (mobile) {

    } else {
        console.log('login called')
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            document.querySelector('.login-user-name').innerHTML = result.user.displayName
            document.querySelector('.login-button').style.display = 'none'
            console.log('login result', result)
            Globals.username = result.user.displayName
            Globals.userId = result.user.uid
            PubSub.publish('login', {userId: result.user.uid})
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

}

