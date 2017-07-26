import firebase from './firebaseService.js'
class User {


  constructor(){
    this.loggedin=false;
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('USER is now logged in', user)
        // User is signed in.
          self.loggedin = true;
          self.data = user;
          // self.id = .
      } else {
        console.log('user is not logged in')
          loggedin = false;
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

