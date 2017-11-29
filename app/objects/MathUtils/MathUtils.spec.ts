import {radian} from './MathUtils';
import {expect} from 'chai'

describe('MathUtils', () => {
    it('percentageToRadians should do 0 -> 0', () => {
        const percentage = 0
        const expectedRadians: radian = 0
        expect(percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do 50 -> pi', () => {
        const percentage = 50
        const expectedRadians: radian = Math.PI
        expect(percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do 25 -> pi/2', () => {
        const percentage = 25
        const expectedRadians: radian  = Math.PI / 2
        expect(percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do 100 -> 2 * pi', () => {
        const percentage = 100
        const expectedRadians: radian = 2 * Math.PI
        expect(percentageToRadians(percentage)).to.equal(expectedRadians)
    })
})
