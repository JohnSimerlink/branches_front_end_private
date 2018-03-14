import test from 'ava'
import PlayButton from './playButton'
let Vue = require('vue').default; // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
import {log} from '../../core/log'

test('playButton', t => {
    const Constructor = Vue.extend(PlayButton);
    const instance = new Constructor();
    instance.$mount();
    log('playButton is ', instance);
    instance.toggleStudying();

    t.pass()
});
