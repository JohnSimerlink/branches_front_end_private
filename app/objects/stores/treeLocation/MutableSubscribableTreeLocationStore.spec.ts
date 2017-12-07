// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {
    IIdProppedDatedMutation, IMutableSubscribableTreeLocationStore,  IProppedDatedMutation,
    ISubscribableUndoableMutablePoint, PointMutationTypes,
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames
} from '../../interfaces';
import {SubscribableMutablePoint} from '../../point/SubscribableMutablePoint';
import {MutableSubscribableTreeLocation} from '../../treeLocation/MutableSubscribableTreeLocation';
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';

describe('MutableSubscribableTreeLocationStore > addMutation', () => {
    it('addMutation to store should call addMutation on the appropriate item,' +
        ' and with a modified mutation argument that no longer has the id', () => {

        const treeId = TREE_ID
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {delta: {x: 3, y: 4}}
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        const store = {}
        store[TREE_ID] = treeLocation
        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore({
            store,
            updatesCallbacks: []
        })
        const treeLocationAddMutationSpy = sinon.spy(treeLocation, 'addMutation')

        const id = TREE_ID
        const proppedMutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            data: MUTATION_VALUE,
            propertyName: TreeLocationPropertyNames.POINT,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }

        const sampleMutation: IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            ...proppedMutation,
            id, //
        }

        treeLocationStore.addMutation(sampleMutation)

        expect(treeLocationAddMutationSpy.callCount).to.equal(1)
        const calledWith = treeLocationAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(proppedMutation)
    })
    // it('addMutation to store that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
    //     ' it either, should throw a RangeError', () => {
    //
    //     const nonExistentId = 'abdf1295'
    //     const store = {}
    //     const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore({
    //         store,
    //         updatesCallbacks: []
    //     })
    //
    //     const NEW_CONTENT_ID = CONTENT_ID2
    //     const proppedMutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
    //         data: 1234,
    //         propertyName: TreeLocationPropertyNames.AGGREGATION_TIMER,
    //         timestamp: Date.now(),
    //         type: FieldMutationTypes.SET,
    //     }
    //
    //     const sampleMutation: IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
    //         ...proppedMutation,
    //         id: nonExistentId,
    //     }
    //
    //     expect(() => treeLocationStore.addMutation(sampleMutation)).to.throw(RangeError)
    //
    // })
})
