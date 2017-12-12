import {expect} from 'chai'
import {stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IActivatableDatedMutation,
    IHash, IMutableSubscribableTree, IMutableSubscribableTreeLocation, ITreeData, ITreeDataWithoutId,
    ITreeLocationData, PointMutationTypes, updatesCallback
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../objects/tree/MutableSubscribableTree';
import {TreeLocationDeserializer} from './TreeLocationDeserializer';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../objects/treeLocation/MutableSubscribableTreeLocation';

describe('TreeLocationDeserializer', () => {
    it('Should deserialize properly with a blank mutation history (besides the mutation from creation)', () => {

        const pointVal = {
            x: 5,
            y: 9,
        }
        const treeLocationData: ITreeLocationData = {
            point: pointVal
        }
        const treeId = '092384'

        const point = new MutableSubscribablePoint({...pointVal})
        const expectedTreeLocation: IMutableSubscribableTreeLocation
            = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        const deserializedTreeLocation: IMutableSubscribableTreeLocation
            = TreeLocationDeserializer.deserialize({treeLocationData})
        expect(deserializedTreeLocation).to.deep.equal(expectedTreeLocation)
    })
    it('Should deserialize properly with a mutation history', () => {

        const pointVal = {
            x: 5,
            y: 9,
        }
        const treeLocationData: ITreeLocationData = {
            point: pointVal
        }
        const treeId = '092384'
        const mutation: IActivatableDatedMutation<PointMutationTypes> = {
            active: true,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
            data: {delta: {x: 2, y: 2}},
        }
        const mutations: Array<IActivatableDatedMutation<PointMutationTypes>>
        = [mutation]

        const point = new MutableSubscribablePoint({...pointVal, mutations})
        const expectedTreeLocation: IMutableSubscribableTreeLocation
            = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        const deserializedTreeLocation: IMutableSubscribableTreeLocation
            = TreeLocationDeserializer.deserialize({treeLocationData})
        expect(deserializedTreeLocation).to.deep.equal(expectedTreeLocation)
    })
})
