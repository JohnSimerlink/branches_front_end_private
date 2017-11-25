import {expect} from 'chai'
import {AB, RUN, SWIM} from './test/AB';

describe('Mixin decorator', () => {

    const x = 8
    const y = 2
    const z = 4
    const w = 1
    const ab = new AB(x, y, z, w)
    it('Should copy over public methods on both classes', () => {
        expect(typeof (ab.swim)).to.equal('function')
        expect(typeof (ab.run)).to.equal('function')
        expect(ab.swim()).to.equal(SWIM)
        expect(ab.run()).to.equal(RUN)
    })
    it('Should copy over public properties on both classes', () => {
        expect(ab.x).to.equal(x)
        expect(ab.z).to.equal(z)
    })
})
