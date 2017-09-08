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
            self.camera = self.branchesData.camera

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
  isAdmin(){
      return this.getId() == 'svyioFSkuqPTf1gjmHYGIsi42IA3'
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
  setCamera({angle, ratio, x, y}){
      const camera = {angle, ratio, x, y}
      console.log('camera in setCamera is ', camera)
      let updates = {
          camera
      }
      firebase.database().ref('users/' + this.getId()).update(updates)
      me.camera = me.branchesData.camera = camera
  }

}

//user singleton
const user = new User()
export default user

