import user from './user.js'
import firebase from './firebaseService.js'

const users = {
} // cache
export default class Users {
    //returns promise
    static get(userId){
        console.log('USERS.get called')
        if (!userId) {
            throw "Users.get(userId) error!. userId empty"
        }
        return new Promise( function getUserPromise (resolve, reject) {

            console.log('getUserPromise called')
            //trees serves as local cash for trees downloaded from db //TODO: this cache should become obselete when we switch to Couchdb+pouchdb
            if (users[userId]){
                resolve(users[userId])
            } else {
                console.log('user not found in cache')
                firebase.database().ref('users/' + userId).on("value", function onFirebaseUserGet(snapshot){
                    let userData = snapshot.val();
                    users[userId] = userData // add to cache
                    resolve(userData)
                })
            }
        })
    }
}
