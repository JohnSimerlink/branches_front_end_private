import firebase from './firebaseService.js'
class User {


  constructor(){
    this.loggedIn=false;
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          self.loggedIn = true;
          self.data = user;
      } else {
        console.log('user is not logged in')
          loggedIn = false;
        // No user is signed in.
      }
    });

  }
  getId(){
    return this.data.uid
  }
}

//user singleton
const user = new User()
export default user

