import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {IMutableSubscribableTreeLocation, ISyncableMutableSubscribableTreeLocation} from '../../objects/interfaces';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {
    getASampleTreeLocation1,
    sampleTreeLocationDataFromFirebase1
} from '../../objects/treeLocation/treeLocationTestHelpers';

myContainerLoadAllModules({fakeSigma: true});
test('TreeLocationDeserializer::::Should deserializeFromDB properly with a blank mutation history' +
    ' (besides the mutation from creation)', (t) => {
    const sampleTreeLocation1: ISyncableMutableSubscribableTreeLocation
        = getASampleTreeLocation1();
    const deserializedTreeLocation: IMutableSubscribableTreeLocation
        = TreeLocationDeserializer.deserializeFromDB({treeLocationDataFromDB: sampleTreeLocationDataFromFirebase1});
    expect(deserializedTreeLocation).to.deep.equal(sampleTreeLocation1);
    t.pass();
});
// it('Should deserializeFromDB properly with a mutation history', () => {
//
//     const pointVal = {
//         x: 5,
//         y: 9,
//     }
//     const treeLocationData: ITreeLocationData = {
//         point: pointVal
//     }
//     const treeId = '092384'
//     const mutation: IActivatableDatedMutation<PointMutationTypes> = {
//         active: true,
//         timestamp: Date.now(),
//         type: PointMutationTypes.SHIFT,
//         data: {delta: {x: 2, y: 2}},
//     }
//     const mutations: Array<IActivatableDatedMutation<PointMutationTypes>>
//     = [mutation]
//
//     const point = new MutableSubscribablePoint({...pointVal, mutations})
//     const expectedTreeLocation: IMutableSubscribableTreeLocation
//         = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
//     const deserializedTreeLocation: IMutableSubscribableTreeLocation
//         = TreeLocationDeserializer.deserializeFromDB({treeLocationData})
//     expect(deserializedTreeLocation).to.deep.equal(expectedTreeLocation)
// })
