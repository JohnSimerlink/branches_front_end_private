import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {MockFirebase} from 'firebase-mock'
import test from 'ava'
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {
    IHash, IOneToManyMap, ISubscribableTreeStoreSource, ITreeDataFromFirebase,
    ITreeLoader
} from '../../objects/interfaces';
import {SpecialTreeLoader, SpecialTreeLoaderArgs} from './specialTreeLoader';
import {FIREBASE_PATHS} from '../paths';
import {expect} from 'chai'
import {TreeLoader, TreeLoaderArgs} from './TreeLoader';
import {partialInject} from '../../testHelpers/partialInject';
import {injectionWorks} from '../../testHelpers/testHelpers';
// test('DI works', (t) => {
//     const injects = injectionWorks<SpecialTreeLoaderArgs, ISpecialTreeLoader>({
//         container: myContainer,
//         argsType: TYPES.SpecialTreeLoaderArgs,
//         interfaceType: TYPES.ISpecialTreeLoader,
//     })
//     expect(injects).to.equal(true)
//     t.pass()
// })
test('SpecialTreeLoader', async (t) => {
    const treeId = '1234'
    const sigmaId = treeId
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const childFirebaseRef = firebaseRef.child(treeId)

    const contentId = '12345532'
    const sampleTreeData: ITreeDataFromFirebase = {
        contentId,
        parentId: '493284',
        children: {
            2948: true,
            2947: true,
        }
    }
    const treeLoader: ITreeLoader = partialInject<TreeLoaderArgs>(
        {
            konstructor: TreeLoader,
            constructorArgsType: TYPES.TreeLoaderArgs,
            injections: {firebaseRef},
            container: myContainer,
        }) // myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
    const contentIdSigmaIdsMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap)
    const specialTreeLoader: ITreeLoader =
        new SpecialTreeLoader({treeLoader, contentIdSigmaIdsMap})

    const treeDataPromise = specialTreeLoader.downloadData(treeId)
    childFirebaseRef.fakeEvent('value', undefined, sampleTreeData)
    childFirebaseRef.flush()
    setTimeout(() => {}, 0)
    await treeDataPromise
    const inMap = contentIdSigmaIdsMap[contentId] && contentIdSigmaIdsMap[contentId][sigmaId]
    expect(inMap).to.equal(true)
    t.pass()
})
