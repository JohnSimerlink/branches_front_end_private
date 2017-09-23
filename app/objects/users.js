import firebase from './firebaseService.js'
import LocalForage from 'localforage'
const users = {
} // cache
export default class Users {
    //returns promise
    static get(userId){
        if (!userId) {
            throw "Users.get(userId) error!. userId empty"
        }
        return new Promise( async function getUserPromise (resolve, reject) {
            //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            if (users[userId]){
                resolve(users[userId])
                return
            }
            const lookupKey = 'users/' + userId

            const userData = await LocalForage.getItem(lookupKey)
                // .then( userData => {
            if (window.fullCache && userData){
                processUserData(userId, userData, resolve)
                return
            }

            firebase.database().ref(lookupKey).once("value", function onFirebaseUserGet(snapshot){
                let userData = snapshot.val();
                LocalForage.setItem(lookupKey, userData)
                processUserData(userId, userData, resolve)
            })
        })
    }
    static getAll(){
        // firebase.database().ref('users/').once("value", function onFirebaseUserGet(snapshot){
        //     let userData = snapshot.val();
        //     users[userId] = userData // add to cache
        //     resolve(userData)
        // })

    }
}
function processUserData(userId, userData, resolve){
    users[userId] = userData // add to cache
    resolve(userData)
}
