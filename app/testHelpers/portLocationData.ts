import * as firebase from 'firebase';
import firebaseDevConfig = require('../objects/firebase.dev.config.json');
import {FIREBASE_PATHS} from '../loaders/paths';
const firebaseConfig = firebaseDevConfig;
import {log} from '../core/log';
firebase.initializeApp(firebaseConfig);
firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
    // .child('1').child('point').update({x: 0, y: 0})
    .child('0544dddbb98b36dd9328eb71ba938465')
    .child('point').update({x: -5, y: -5});
log('ref updated' );
