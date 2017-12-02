import {expect} from 'chai'
import {radian} from '../interfaces';
import {MathUtils} from './MathUtils';

describe('MathUtils', () => {
    it('percentageToRadians should do 0 -> 0', () => {
        const percentage = 0
        const expectedRadians: radian = 0
        expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do .50 -> pi', () => {
        const percentage = .50
        const expectedRadians: radian = Math.PI
        expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do .25 -> pi/2', () => {
        const percentage = .25
        const expectedRadians: radian  = Math.PI / 2
        expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians)
    })
    it('percentageToRadians should do 1.00 -> 2 * pi', () => {
        const percentage = 1.00
        const expectedRadians: radian = 2 * Math.PI
        expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians)
    })
})
