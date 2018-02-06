import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';
import {ContentUserData} from './ContentUserData';
import {ContentUserDataUtils}  from './ContentUserDataUtils';

import test from 'ava'
import {DEFAULT_NODE_SIZE} from '../../core/globals';
test('should always return normal size for val size', (t) => {
    const contentUserData = myContainer.get<ContentUserData>(TYPES.IContentUserData)
    const size = ContentUserDataUtils.getSizeFromContentUserData(contentUserData)
    expect(size).to.equal(DEFAULT_NODE_SIZE)
    t.pass()
})
