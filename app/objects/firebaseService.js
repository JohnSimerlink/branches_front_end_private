import * as firebase from 'firebase'
import {Config} from '../core/config'
import firebaseDevConfig from './firebase.dev.config.json';
import firebaseProdConfig from './firebase.prod.config.json';

function firebaseInitialized() {
  return firebase.apps.length !== 0;
}
function initializeFirebase(){
    const firebaseConfig = Config.env == 'prod' ? firebaseProdConfig : firebaseDevConfig;
    firebase.initializeApp(firebaseConfig);
    window.firebase = firebase;
}

export default function getFirebase(){
  if (!firebaseInitialized()){
    initializeFirebase()
  }
  return firebase //TODO: initfirebase might actually be async
}