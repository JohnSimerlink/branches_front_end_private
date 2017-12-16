import test from 'ava'
import {Somefile} from './somefile';

test('Somefile', t  => {
    const somefile = new Somefile(3, 4)
    t.is(1, 1)
})
test('Somefile2', t  => {
    const somefile = new Somefile(3, 4)
    t.is(2, 2)
})
test('Somefile3', t  => {
    const somefile = new Somefile(3, 4)
    t.is(3, 3)
})
