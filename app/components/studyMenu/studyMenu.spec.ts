import test from 'ava'
import StudyMenu from './studyMenu'
import {log} from '../../core/log'

let Vue = require('vue').default; // for webpack
if (!Vue) {
    Vue = require('vue'); // for ava-ts tests
}

test('studyMenu', t => {
    const Constructor = Vue.extend(StudyMenu);
    const instance = new Constructor();
    instance.$mount();
    log('studyMenu is ', instance);
    instance.toggleStudying();

    t.pass();
});
