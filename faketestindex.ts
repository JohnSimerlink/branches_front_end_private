import * as firebase from 'firebase'
import {log} from './app/core/log'
const firebaseConfig = {
    apiKey: 'AIzaSyCqzA9NxQsKpY4WzKbJf59nvrf-8-60i8A',
    authDomain: 'branches-dev.firebaseapp.com',
    databaseURL: 'https://branches-dev.firebaseio.com',
    projectId: 'branches-dev',
    storageBucket: 'branches-dev.appspot.com',
    messagingSenderId: '354929800016'
}
firebase.initializeApp(firebaseConfig)
const ref = firebase.database().ref('trees')
log('ref is ' + ref)
