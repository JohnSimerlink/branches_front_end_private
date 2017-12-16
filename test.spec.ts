import test from 'ava'
import {expect} from 'chai'
test.failing('1 + 2 = 3', t => {
    t.is(1 + 2, 3)
    expect({a: 4, b: 6}).to.equal({b: 6, a: 4})
    // throw new Error('hi')
})
test('1 + 2 = 3', t => {
    t.is(1 + 2, 3)
    // throw new Error('hi')
})
