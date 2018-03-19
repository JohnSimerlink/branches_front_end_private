import test from 'ava';
import PlayButton from './playButton';
import {log} from '../../core/log';

const Vue = require('vue').default || require('vue'); // for webpack

test('playButton', t => {
    const Constructor = Vue.extend(PlayButton);
    const instance = new Constructor();
    instance.$mount();
    log('playButton is ', instance);
    instance.toggleStudying();

    t.pass();
});
