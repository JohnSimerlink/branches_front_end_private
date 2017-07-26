import getFirebase from './firebaseService.js'
var firebase = getFirebase()
class User {


  constructor(){
    this.signedIn=false;
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('USER is now logged in', user)
        // User is signed in.
          self.signedIn = true;
          self.data = user;
          // self.id = .
      } else {
        console.log('user is not logged in')
          signedIn = false;
        // No user is signed in.
      }
    });

  }
  getId(){

  }
}

//user singleton
const user = new User()
export default user

