import * as firebase from 'firebase'
import firebaseDevConfig from './firebase.dev.config.json';

function firebaseInitialized() {
  return firebase.apps.length !== 0;
}
function initializeFirebase(){
    firebase.initializeApp(firebaseDevConfig);
}

export default function getFirebase(){
  // console.log('get firebase called');
  if (!firebaseInitialized()){
    initializeFirebase()
  }
  return firebase //TODO: initfirebase might actually be async
}