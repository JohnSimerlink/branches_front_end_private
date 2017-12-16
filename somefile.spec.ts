import test from 'ava'
import {expect} from 'chai'
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
test.failing('Somefile4', t  => {
    const somefile = new Somefile(3, 4)
    t.is(4, 4)
    expect(3).to.equal(4)
    t.pass()
})
