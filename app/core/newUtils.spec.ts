import {expect} from 'chai'
import {stripTrailingSlash} from './newUtils';

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
