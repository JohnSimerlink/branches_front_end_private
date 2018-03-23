const fileStart = Date.now()
console.log('start: ', fileStart)
import test from 'ava';
import {ISubscribableContentUserStoreSource} from '../../objects/interfaces';
console.log('checkpoint0.9: ', Date.now() - fileStart)
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
console.log('checkpoint1.2: ', Date.now() - fileStart)
import {TYPES} from '../../objects/types';
import {
    getASampleContentUser1,
    sampleContentUser1ContentId, sampleContentUser1Id,
    sampleContentUser1UserId
} from '../../objects/contentUser/contentUserTestHelpers';
import {expect} from 'chai';
import {ContentUserLoader, ContentUserLoaderArgs} from './ContentUserLoader';
import {partialInject} from '../../testHelpers/partialInject';
// injectFakeDom();
myContainerLoadAllModules({fakeSigma: true})
console.log('checkpoint1.21: ', Date.now() - fileStart)
test('ContentUserLoader:::Should mark an id as loaded if test exists in the injected storeSource', (t) => {
    const storeSource: ISubscribableContentUserStoreSource =
        myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource);

    const contentId = sampleContentUser1ContentId
    const userId = sampleContentUser1UserId
    const contentUserLoader =
        partialInject<ContentUserLoaderArgs>({
            konstructor: ContentUserLoader,
            constructorArgsType: TYPES.ContentUserLoaderArgs,
            injections: {
                storeSource,
            },
            container: myContainer,
        })

    // TODO: we may not even have to do a partial injection ^^^
    let isLoaded = contentUserLoader.isLoaded(
        {contentId: sampleContentUser1ContentId, userId: sampleContentUser1UserId})
    expect(isLoaded).to.deep.equal(false)
    storeSource.set(sampleContentUser1Id, getASampleContentUser1())
    isLoaded = contentUserLoader.isLoaded({contentId, userId})
    expect(isLoaded).to.deep.equal(true)
    console.log('checkpoint0.93: ', Date.now() - fileStart)
    t.pass()
})
