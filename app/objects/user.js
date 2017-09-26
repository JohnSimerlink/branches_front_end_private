console.log(".5: user.js just called", calculateLoadTimeSoFar(Date.now()))
import firebase from './firebaseService.js'
import {clearInteractionsForHeadings} from "../fixData";
import LocalForage from 'localforage'
import Users from './users'
let userLoggedIn = false
let cachedId = null
import store from '../core/store'
class User {

  constructor() {
      this.loggedIn = false;
      this.branchesData = {}
      this.dataLoaded = false
      const me = this;

      console.log(".501: user.js get userId from cache about to be called", calculateLoadTimeSoFar(Date.now()))
      const userId = window.cachedUserId

      console.log(".51: user.js get userId from cache just called", calculateLoadTimeSoFar(Date.now()))

      if (userId){
          // console.log(".515: user.js userId from cache is ",userId, calculateLoadTimeSoFar(Date.now()))
          // window.cachedUserId = userId
          // PubSub.publish('userId')
          this.loadBranchesData()
          me.dataGoingToBeLoaded = true
      }

      firebase.auth().onAuthStateChanged(async (user) => {
          console.log(".6: onAuthStateChanged called ", calculateLoadTimeSoFar(Date.now()))
          if (user) {
              me.loggedIn = true;
              userLoggedIn = true
              me.fbData = user;
              localStorage.setItem('userId', me.getId())
              // LocalForage.setItem('userId', me.getId())
              if(!me.dataGoingToBeLoaded){
                  PubSub.publish('userId')
                  await me.loadBranchesData()
              }
          } else {
              me.loggedIn = false
          }
      })

  }
  async loadBranchesData(){
      console.log(".52: user.js loadBranchesData just called", calculateLoadTimeSoFar(Date.now()))
      const me = this
      const user = await Users.get(this.getId())
      me.branchesData = user || {}
      me.branchesData.patches = me.branchesData.patches || {}
      me.branchesData.items = me.branchesData.items || {}
      me.branchesData.mutations = me.branchesData.mutations || []
      me.camera = me.branchesData.camera
      me.applyDataPatches()
      me.dataLoaded = true
      console.log(".7: loadBranchesData loaded ", calculateLoadTimeSoFar(Date.now()))
      PubSub.publish('login')
      console.log("2.5: PubSub publish login", calculateLoadTimeSoFar(Date.now()))
      me.subscribeToMutations()
  }
  getId() {
      return (this.fbData && this.fbData.uid) || window.cachedUserId || 0
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
  addInteraction(contentItemId,interaction, addChangeToDB){
      const item = this.branchesData.items[contentItemId] || {}
      item.interactions = item.interactions || []
      item.interactions.push(interaction)
      this.branchesData.items[contentItemId]
      if (!addChangeToDB) {
          return
      }

      const updates = {
          interactions: item.interactions,
      }
      firebase.database().ref('users/' + this.getId() + '/items/' + contentItemId +'/').update(updates)
  }

  setCamera({angle, ratio, x, y}){
      if (!angle) return;
      const me = this
      angle = angle || me.camera.angle
      ratio = ratio || me.camera.ratio
      x = x || me.camera.x
      y = y || me.camera.y
      const camera = {angle, ratio, x, y}
      let updates = {
          camera
      };
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

    setInteractionsForItem(itemId, interactions, addChangeToDB){
        if (!this.branchesData.items[itemId]) return

        this.branchesData.items[itemId].interactions = interactions

        if (!addChangeToDB){
            return
        }

        var updates = {interactions}
        firebase.database().ref('users/' +this.getId() + '/items/' + itemId + '/').update(updates)
    }

    clearInteractionsForItem(itemId, addChangeToDB){
        this.setInteractionsForItem(itemId, [], addChangeToDB)
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
    async addMutation(type, data){
        const action = {
            type,
            data,
            sessionId: window.sessionId
        }
        const mutation = {
            timestamp: Date.now(),
            action
        }
        this.performMutation(mutation)
        this.branchesData.mutations.push(mutation)
        const updates = {
            mutations: this.branchesData.mutations
        }
        firebase.database().ref('users/' + this.getId() + '/').update(updates)
    }
    subscribeToMutations(){
        const me = this
        firebase.database().ref('users/' + this.getId() + '/' + 'mutations').on('value', snapshot => {
            const mutationsArray = snapshot.val()
            if (!mutationsArray) return
            const mostRecentMutation = mutationsArray.length ? mutationsArray[mutationsArray.length - 1] : null
            if (!mostRecentMutation) return
            if (mostRecentMutation.timestamp <= window.startTime){
               return
            }
            if (this.mutationIsFromThisDevice(mostRecentMutation)){
                return
            }

            me.performMutation(mostRecentMutation)
        })
    }
    mutationIsFromThisDevice(mutation){
        return mutation && mutation.action && mutation.action.sessionId === window.sessionId
    }
    performMutation(mutation){
        const action = mutation.action
        const addChangeToDB = this.mutationIsFromThisDevice()
        store.commit(action.type, {data: action.data, addChangeToDB})

    }
}

//user singleton
const user = new User()
window.user = user
export default user

