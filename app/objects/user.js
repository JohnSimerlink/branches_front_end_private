import firebase from './firebaseService.js'
import {clearInteractionsForHeadings} from "../fixData";
import Users from './users'
let userLoggedIn = false
class User {

  constructor() {
      this.loggedIn = false;
      this.branchesData = {}
      this.dataLoaded = false
      const me = this;
      firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
              me.loggedIn = true;
              userLoggedIn = true
              me.fbData = user;
              await me.loadBranchesData()
              PubSub.publish('login')
          } else {
              me.loggedIn = false
          }
      })
  }
  async loadBranchesData(){
      const me = this
      const user = await Users.get(this.getId())
      me.branchesData = user || {}
      me.branchesData.patches = me.branchesData.patches || {}
      me.branchesData.items = me.branchesData.items || {}
      me.camera = me.branchesData.camera
      me.applyDataPatches()
      me.dataLoaded = true
  }
  getId() {
      return this.fbData && this.fbData.uid || 0
  }
  isAdmin() {
      return this.getId() == 'svyioFSkuqPTf1gjmHYGIsi42IA3'
  }
  //should only be called after login event
  async getStudySettings(){
      return this.branchesData.studySettings
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
            await clearInteractionsForHeadings()
            this.branchesData.patches.headingInteractions = true
            var updates = {
                patches: this.branchesData.patches
            }
            firebase.database().ref('users/' + this.getId() + '/').update(updates)
        } else {
        }

    }
    async applyUpdates(updates){
        return await firebase.database().ref('users/' + this.getId() + '/').update(updates)
    }


}

//user singleton
const user = new User()
export default user

