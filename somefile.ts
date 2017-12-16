import * as firebase from 'firebase'
export const FIREBASE_PATHS = {
    TREES: 'trees',
    TREE_LOCATIONS: 'treeLocations'
}

const firebaseConfig =
{
    "apiKey": "AIzaSyCqzA9NxQsKpY4WzKbJf59nvrf-8-60i8A",
    "authDomain": "branches-dev.firebaseapp.com",
    "databaseURL": "https://branches-dev.firebaseio.com",
    "projectId": "branches-dev",
    "storageBucket": "branches-dev.appspot.com",
    "messagingSenderId": "354929800016"
}
firebase.initializeApp(firebaseConfig)
const treesRef = firebase.database().ref(FIREBASE_PATHS.TREES)
const somefile = '12345'
export class Somefile {
    private x
    private y
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
