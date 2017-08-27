import firebase from './firebaseService.js'

import Users from './users'
class User {

  constructor(){
    this.loggedIn=false;
    this.branchesData = {}
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          PubSub.publish('login')
          self.loggedIn = true;
          self.fbData = user;
          Users.get(self.getId()).then(user => {

            self.branchesData = user || {}

            self.branchesData.items = self.branchesData.items || {}
            // self.branchesData.itemReviewTimeMap = self.branchesData.itemReviewTimeMap || {}

          })
      } else {
          self.loggedIn = false;
      }
    });

  }
  getId(){
    return this.fbData.uid
  }

  setItemProperties(itemId, obj){

    this.branchesData.items[itemId] = this.branchesData.items[itemId] || {}
    for (let prop in obj){
        this.branchesData.items[itemId][prop] = obj[prop]
    }
    let updates = {
      items: this.branchesData.items
    }
    firebase.database().ref('users/' + this.getId()).update(updates)
  }
}

//user singleton
const user = new User()
export default user

