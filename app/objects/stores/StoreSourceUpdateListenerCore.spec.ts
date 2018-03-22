import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import {expect} from 'chai';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IStoreSourceUpdateListenerCore, ITreeDataWithoutId, ITypeAndIdAndValUpdate,
    CustomStoreDataTypes,
} from '../interfaces';
import {TYPES} from '../types';
import {StoreSourceUpdateListenerCore, StoreSourceUpdateListenerCoreArgs} from './StoreSourceUpdateListenerCore';
import test from 'ava';

myContainerLoadAllModules({fakeSigma: true});
test('StoreSourceUpdateListenerCore::::DI constructor should work', (t) => {
    const injects = injectionWorks<StoreSourceUpdateListenerCoreArgs, IStoreSourceUpdateListenerCore>({
        container: myContainer,
        argsType: TYPES.StoreSourceUpdateListenerCoreArgs,
        interfaceType: TYPES.IStoreSourceUpdateListenerCore,
    });
    expect(injects).to.equal(true);
    t.pass();
});
