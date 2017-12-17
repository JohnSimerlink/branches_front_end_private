import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {
    IMutableSubscribableTreeLocation,
    ITreeLocationData,
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../objects/treeLocation/MutableSubscribableTreeLocation';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';

test('TreeLocationDeserializer::::Should deserialize properly with a blank mutation history' +
    ' (besides the mutation from creation)', (t) => {

    const pointVal = {
        x: 5,
        y: 9,
    }
    const treeLocationData: ITreeLocationData = {
        point: pointVal
    }

    const point = new MutableSubscribablePoint({...pointVal})
    const expectedTreeLocation: IMutableSubscribableTreeLocation
        = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
    const deserializedTreeLocation: IMutableSubscribableTreeLocation
        = TreeLocationDeserializer.deserialize({treeLocationData})
    expect(deserializedTreeLocation).to.deep.equal(expectedTreeLocation)
    t.pass()
})
// it('Should deserialize properly with a mutation history', () => {
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
//         = TreeLocationDeserializer.deserialize({treeLocationData})
//     expect(deserializedTreeLocation).to.deep.equal(expectedTreeLocation)
// })
