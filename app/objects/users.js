import user from './user.js'
import firebase from './firebaseService.js'

const users = {
} // cache
export default class Users {
    //returns promise
    static get(userId){
        if (!userId) {
            throw "Users.get(userId) error!. userId empty"
        }
        return new Promise( function getTreePromise (resolve, reject) {

            //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            if (users[userId]){
                resolve(users[userId])
            } else {
                firebase.database().ref('users/' + userId).on("value", function onFirebaseTreeGet(snapshot){
                    let userData = snapshot.val();
                    users[userId] = userData // add to cache
                    resolve(userData)
                })
            }
        })
    }
}
