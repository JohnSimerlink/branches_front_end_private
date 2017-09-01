import {calculateMillisecondsTilNextReview} from '../app/components/reviewAlgorithm/review'
import {expect} from 'chai'
describe('Calculate Review from interaction history', function() {
    it('should return 2 for 1+1', function() {
        expect(2).to.equal(2)
    })
})
describe('Calculate Review from interaction history with length 1', function() {
    it('should return 2minutes for <33%', function() {
        expect(calculateMillisecondsTilNextReview([{time: 'some time', proficiency: 32}])).to.equal(2 * 60 * 1000)
        expect(calculateMillisecondsTilNextReview([{time: 'some time', proficiency: 35}])).to.equal(10 * 60 * 1000)
    })
})
describe('Calculate Review from interaction history for streaks of high proficiency', function() {
    it('5 days for a 2x streak', function() {
        expect(calculateMillisecondsTilNextReview([{time: 'some time', proficiency: 32},{time: 'some time', proficiency: 97},{time: 'some time', proficiency: 98}])).to.equal(5 * 24 * 60 * 60 * 1000)
    })
    it('25 days for a 3x streak', function() {
        expect(calculateMillisecondsTilNextReview([{time: 'some time', proficiency: 98},{time: 'some time', proficiency: 32},{time: 'some time', proficiency: 97},{time: 'some time', proficiency: 98},{time: 'some time', proficiency: 98}])).to.equal(5 * 5 * 24 * 60 * 60 * 1000)
    })
})
