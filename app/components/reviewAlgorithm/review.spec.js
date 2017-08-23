import {caclulateMinutesTilNextReview} from './review'
describe('Calculate Review from interaction history', function() {
    it('should return 2 for 1+1', function() {
        expect(2).toBe(2)
    })
})
describe('Calculate Review from interaction history with length 1', function() {
    it('should return 2minutes for <33%', function() {
        expect(calculateMinutesTilNextReview({time: 'some time', proficiency: 32})).toBe(2)
        expect(calculateMinutesTilNextReview({time: 'some time', proficiency: 35})).toBe(10)
    })
})
describe('Calculate Review from interaction history for streaks of high proficiency', function() {
    it('5 days for a 2x streak', function() {
        expect(calculateMinutesTilNextReview({time: 'some time', proficiency: 32},{time: 'some time', proficiency: 97},{time: 'some time', proficiency: 98})).toBe(5 * 24 * 60)
    })
    it('25 days for a 3x streak', function() {

        expect(calculateMinutesTilNextReview({time: 'some time', proficiency: 98},{time: 'some time', proficiency: 32},{time: 'some time', proficiency: 97},{time: 'some time', proficiency: 98},{time: 'some time', proficiency: 98})).toBe(5 * 24 * 60)
    })
})
