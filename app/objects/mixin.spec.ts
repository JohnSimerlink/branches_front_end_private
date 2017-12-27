import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {AB, RUN, SWIM} from './test/AB';

const x = 8
const y = 2
const z = 4
const w = 1
const ab = new AB(x, y, z, w)
test('Mixin decorator::::Should copy over public methods on both classes', (t) => {
    expect(typeof (ab.swim)).to.equal('function')
    expect(typeof (ab.run)).to.equal('function')
    expect(ab.swim()).to.equal(SWIM)
    expect(ab.run()).to.equal(RUN)
    t.pass()
})
test('Mixin decorator::::Should copy over public properties on both classes', (t) => {
    expect(ab.x).to.equal(x)
    expect(ab.z).to.equal(z)
    t.pass()
})
