import * as firebase from 'firebase'
import register from 'ignore-styles'
import {log} from './app/core/log'
import {FieldMutationTypes, IDatedMutation} from './app/objects/interfaces';
import {TYPES} from './app/objects/types';
import {myContainer} from './inversify.config';
register(['.html', '.png'])
process.env.NODE_ENV = 'test' && register(['.html'])
const template = require('./app/components/knawledgeMap/knawledgeMap.html')
const img = require('./app/components/knawledgeMap/views/img.png')
//
// const firebaseConfig = {
//     apiKey: 'AIzaSyCqzA9NxQsKpY4WzKbJf59nvrf-8-60i8A',
//     authDomain: 'branches-dev.firebaseapp.com',
//     databaseURL: 'https://branches-dev.firebaseio.com',
//     projectId: 'branches-dev',
//     storageBucket: 'branches-dev.appspot.com',
//     messagingSenderId: '354929800016'
// }
// firebase.initializeApp(firebaseConfig)
// const ref = firebase.database().ref('trees')
// log('ref is ' + ref)
const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IProppedDatedMutation)
log('require.extensions ' + JSON.stringify(require.extensions))
log( ' imgh' + img + JSON.stringify(template))
