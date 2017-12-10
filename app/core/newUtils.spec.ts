import {expect} from 'chai'
import {stringArrayToSet, stripTrailingSlash} from './newUtils';

describe('stripTrailingSlash', () => {
    it('should return falsey for blank inputs', () => {
        let falsey = !stripTrailingSlash('')
        expect(falsey).to.equal(true)
        falsey = !stripTrailingSlash(null)
        expect(falsey).to.equal(true)
    })
    it('should return blank for /', () => {
        const result = stripTrailingSlash('/')
        expect(result).to.equal('')
    })
    it('should strip slashes for other values', () => {
        let result = stripTrailingSlash('people/tai/')
        expect(result).to.equal('people/tai')
        result = stripTrailingSlash('books/goodbooks/thethirdwave/')
        expect(result).to.equal('books/goodbooks/thethirdwave')
    })
    it('should keep the same when no trailing slash', () => {
        let result = stripTrailingSlash('people/tai')
        expect(result).to.equal('people/tai')
        result = stripTrailingSlash('books/goodbooks/thethirdwave')
        expect(result).to.equal('books/goodbooks/thethirdwave')
    })
})

describe('stringArrayToSet', () => {
    it('should return {} for []', () => {
        const set = stringArrayToSet([])
        expect(set).to.deep.equal({})
    })
    it('should return {a: true, b: true} for ["a",b"]', () => {
        const set = stringArrayToSet(['a', 'b'])
        expect(set).to.deep.equal({a: true, b: true})
    })
})
