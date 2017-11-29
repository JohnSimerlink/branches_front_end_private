import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';
import {ContentUserData} from './ContentUserData';
import {ContentUserDataUtils, REGULAR_SIZE} from './ContentUserDataUtils';

describe('ContentUserDataUtils', () => {
    it('should always return normal size for get size', () => {
        const contentUserData = myContainer.get<ContentUserData>(TYPES.IContentUserData)
        const size = ContentUserDataUtils.getSizeFromContentUserData(contentUserData)
        expect(size).to.equal(REGULAR_SIZE)
    })
})
