import test from 'ava'
import {getUserId, separator} from './ContentUserLoaderUtils';
import {expect} from 'chai'

test('getUserId', t => {
    const contentId = '431'
    const userId = 'ab987'
    const contentUserId =  contentId + separator + userId

    const calculatedUserId = getUserId({contentUserId})
    expect(calculatedUserId).to.deep.equal(contentUserId)
    t.pass()
})
