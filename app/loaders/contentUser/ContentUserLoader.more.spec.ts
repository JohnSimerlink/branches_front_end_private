import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava';
import {ISubscribableContentUserStoreSource} from '../../objects/interfaces';
import {contentUsersRef, myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {
    getASampleContentUser1,
    sampleContentUser1ContentId, sampleContentUser1Id,
    sampleContentUser1UserId
} from '../../objects/contentUser/contentUserTestHelpers';
import {expect} from 'chai';
import {ContentUserLoader} from './ContentUserLoader';
myContainerLoadAllModules({fakeSigma: true})
test('ContentUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);

    const contentId = sampleContentUser1ContentId
    const userId = sampleContentUser1UserId
    const contentUserLoader = new ContentUserLoader({storeSource, firebaseRef: contentUsersRef})
    let isLoaded = contentUserLoader.isLoaded(
        {contentId: sampleContentUser1ContentId, userId: sampleContentUser1UserId})
    expect(isLoaded).to.deep.equal(false)
    storeSource.set(sampleContentUser1Id, getASampleContentUser1())
    isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.deep.equal(true)
    t.pass()
})
