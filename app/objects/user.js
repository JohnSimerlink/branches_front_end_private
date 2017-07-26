import firebase from './firebaseService.js'
class User {


  constructor(){
    this.loggedIn=false;
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('USER is now logged in', user)
        // User is signed in.
          self.loggedIn = true;
          self.data = user;
          console.log('user data is', self.data)
          // self.id = .
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

