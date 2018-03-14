import * as firebase from 'firebase';
import {FIREBASE_PATHS} from '../loaders/paths';
import {log} from '../core/log';
import {ANOTHER_CONTENT_ID} from '../core/globals';
import firebaseDevConfig = require('../objects/firebase.dev.config.json');

const firebaseConfig = firebaseDevConfig;
firebase.initializeApp(firebaseConfig);
firebase.database().ref(FIREBASE_PATHS.CONTENT_USERS)
// .child('1').child('point').update({x: 0, y: 0})
    .child(ANOTHER_CONTENT_ID)
    .child('point').update({x: -5, y: -5});
log('ref updated' );
