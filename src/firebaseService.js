import * as firebase from 'firebase'
import firebaseDevConfig from './firebase.dev.config.json';

function firebaseInitialized() {
  return firebase.apps.length !== 0;
}
function initializeFirebase(){
    firebase.initializeApp(firebaseDevConfig);
    window.firebase = firebase;
}

export default function getFirebase(){
  if (!firebaseInitialized()){
    initializeFirebase()
  }
  return firebase //TODO: initfirebase might actually be async
}