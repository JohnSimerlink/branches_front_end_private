import * as firebase from 'firebase'
import {Config} from '../core/config'
import firebaseDevConfig from './firebase.dev.config.json';
import firebaseProdConfig from './firebase.prod.config.json';

const firebaseConfig = Config.env == 'prod' ? firebaseProdConfig : firebaseDevConfig;

firebase.initializeApp(firebaseConfig);

window.firebase = firebase; // for debugging from the console
export default firebase;
