import firebase from 'firebase'
import App from './App.vue'
import VueFire from 'vuefire'
import Vue from 'vue'

console.log('welcome to the app');
console.log('firebase is ', firebase );

Vue.use(VueFire)

    var config = {
        apiKey: "AIzaSyC8v-QacPJKuPbkw0bN-g4w-r7BMOxydNg",
        authDomain: "treesy-ac1ab.firebaseapp.com",
        databaseURL: "https://treesy-ac1ab.firebaseio.com",
        projectId: "treesy-ac1ab",
        storageBucket: "treesy-ac1ab.appspot.com",
        messagingSenderId: "542345567878"
    };
    firebase.initializeApp(config);

new Vue({
  el: '#app',
  render: h => h(App)
})
