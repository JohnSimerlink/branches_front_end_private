import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IBranchesMapLoader, ISyncableMutableSubscribableBranchesMap, IBranchesMapDataFromDB
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {BranchesMapLoader, BranchesMapLoaderArgs} from './BranchesMapLoader';
import {
    sampleBranchesMap1,
    sampleBranchesMapData1,
    sampleBranchesMapData1RootTreeId,
    sampleBranchesMapDataFromDB1
} from '../../objects/branchesMap/branchesMapTestHelpers';
myContainerLoadAllModules()
test('BranchesMapLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<BranchesMapLoaderArgs, IBranchesMapLoader>({
        container: myContainer,
        argsType: TYPES.BranchesMapLoaderArgs,
        interfaceType: TYPES.IBranchesMapLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
