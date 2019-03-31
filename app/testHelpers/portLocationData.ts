import * as firebase
	from 'firebase';
import {FIREBASE_PATHS} from '../loaders/paths';
import {log} from '../core/log';
import firebaseDevConfig = require('../objects/firebase.dev.config.json');

const firebaseConfig = firebaseDevConfig;
firebase.initializeApp(firebaseConfig);
firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
// .child('1').child('point').update({x: 0, y: 0})
	.child('0544dddbb98b36dd9328eb71ba938465')
	.child('point').update({
	x: -5,
	y: -5
});
log('ref updated');
