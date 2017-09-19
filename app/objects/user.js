import firebase from './firebaseService.js'
import {clearInteractionsForHeadings} from "../fixData";
import Users from './users'
class User {

  constructor() {
      this.loggedIn = false;
      this.branchesData = {}
      const me = this;
      firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
              PubSub.publish('login')
              me.loggedIn = true;
              me.fbData = user;
              Users.get(me.getId()).then(user => {
                  me.branchesData = user || {}
                  me.branchesData.patches = me.branchesData.patches || {}
                  me.branchesData.items = me.branchesData.items || {}
                  me.camera = me.branchesData.camera
                  me.applyDataPatches()
              })
          } else {
              me.loggedIn = false
          }
      })
  }
  getId() {
      return this.fbData && this.fbData.uid || 0
  }
  isAdmin() {
      return this.getId() == 'svyioFSkuqPTf1gjmHYGIsi42IA3'
  }

  // setItemProperties(itemId, obj){
  //
  //   this.branchesData.items[itemId] = this.branchesData.items[itemId] || {}
  //   for (let prop in obj){
  //       this.branchesData.items[itemId][prop] = obj[prop]
  //   }
  //   let updates = {
  //     items: this.branchesData.items
  //   }
  //   firebase.database().ref('users/' + this.getId()).update(updates)
  // }
  addInteraction(contentItemId,interaction){
      const item = this.branchesData.items[contentItemId] || {}
      item.interactions = item.interactions || []
      item.interactions.push(interaction)
      const updates = {
          interactions: item.interactions,
      }
      this.branchesData.items[contentItemId]
      firebase.database().ref('users/' + this.getId() + '/items/' + contentItemId +'/').update(updates)
  }

  setCamera({angle, ratio, x, y}){
      const me = this
      angle = angle || me.camera.angle
      ratio = ratio || me.camera.ratio
      x = x || me.camera.x
      y = y || me.camera.y
      const camera = {angle, ratio, x, y}
      let updates = {
          camera
      }
      firebase.database().ref('users/' + this.getId()).update(updates)
      me.camera = me.branchesData.camera = camera
  }

    set(prop, val){
        if (this[prop] == val) {
            return;
        }

        var updates = {}
        updates[prop] = val
        // this.treeRef.update(updates)
        firebase.database().ref('users/' +this.getId()).update(updates)
        this[prop] = val
    }

    setInteractionsForItem(itemId, interactions){
        console.log('setInteractionsForItem is ', itemId, interactions)
        if (!this.branchesData.items[itemId]) return

        this.branchesData.items[itemId].interactions = interactions
        var updates = {interactions}
        firebase.database().ref('users/' +this.getId() + '/items/' + itemId + '/').update(updates)
    }

    clearInteractionsForItem(itemId){
        this.setInteractionsForItem(itemId, [])
    }

    async applyDataPatches(){
        if (!this.branchesData.patches.headingInteractions){
            console.log("PATCHES: applying clearInteractionsForHeadingsPatch!")
            await clearInteractionsForHeadings()
            this.branchesData.patches.headingInteractions = true
            var updates = {
                patches: this.branchesData.patches
            }
            firebase.database().ref('users/' + this.getId() + '/').update(updates)
        } else {
            console.log('PATCHES: no patches to apply')
        }

    }


}

//user singleton
const user = new User()
export default user

