import {expect} from 'chai'
describe('measuringPreviousStrength', () => {
    it('Should ', () => {
        try {
            expect(curve.measurePreviousStrength(40, 99, 2)).to.equal(40)
            expect(curve.measurePreviousStrength(40, 99.9, 2)).to.equal(40)
        } catch (err) {
            console.error("there was an error", err)
        }
    })
})
