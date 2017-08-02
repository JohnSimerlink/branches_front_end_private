import firebase from './firebaseService.js'
import PubSub from 'pubsub-js'
class User {


  constructor(){
    this.loggedIn=false;
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('USER.js user just logged in')
          PubSub.publish('login')
          self.loggedIn = true;
          self.fbData = user;
          Users.get(self.getId()).then(user => {
            self.branchesData = user

            self.branchesData.itemReviewTimeMap = self.branchesData.itemReviewTimeMap || {}

          })
      } else {
        console.log('USER.js user is not logged in')
          self.loggedIn = false;
        // No user is signed in.
      }
    });

  }
  getId(){
    return this.fbData.uid
  }

  addItemReviewTime(itemReviewTime){
    console.log('user.addItemReviewTime just called')
    this.branchesData.itemReviewTimeMap[itemReviewTime.id] = itemReviewTime.nextReviewTime
    let updates = {
      itemReviewTimeMap: this.branchesData.itemReviewTimeMap
    }
    firebase.database().ref('users/' + this.getId()).update(updates)
  }
}

//user singleton
const user = new User()
export default user

