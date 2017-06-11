import * as firebase from 'firebase'
import firebaseDevConfig from './firebase.dev.config.json';

function firebaseInitialized() {
  return firebase.apps.length !== 0;
}
function initializeFirebase(){
    // var config = {
    //     apiKey: "AIzaSyC8v-QacPJKuPbkw0bN-g4w-r7BMOxydNg",
    //     authDomain: "treesy-ac1ab.firebaseapp.com",
    //     databaseURL: "https://treesy-ac1ab.firebaseio.com",
    //     projectId: "treesy-ac1ab",
    //     storageBucket: "treesy-ac1ab.appspot.com",
    //     messagingSenderId: "542345567878"
    // };
    firebase.initializeApp(firebaseDevConfig);
    // firebase.database.ref().update({
    //   'facts/24': {question: 'this is a q', answer:' this is an a'}
    // })
    // console.log('firebase intiialized');
}

export default function getFirebase(){
  console.log('get firebase called');
  if (!firebaseInitialized()){
    initializeFirebase()
  }
  return firebase //TODO: initfirebase might actually be async
}